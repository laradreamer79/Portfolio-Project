import {
  assertCatalogAccess,
  catalogDetailVisibilityWhere,
  catalogVisibilityWhere,
  resolveCatalogCreateOwnership,
  resolveCatalogUpdateOwnership,
  type CatalogActor,
} from "../common/catalog/catalog-ownership.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import type {
  TripCreateInput,
  TripQueryInput,
  TripUpdateInput,
} from "./trips.validation.js";

type TripCreateCommand = TripCreateInput & {
  imageUrl?: string;
};

type TripUpdateCommand = TripUpdateInput & {
  imageUrl?: string;
};

type TripFilters = TripQueryInput & {
  actor?: CatalogActor;
};

const tripListInclude = {
  center: { select: { id: true, name: true, city: true } },
  instructor: {
    select: {
      id: true,
      name: true,
      instructorProfile: { select: { city: true } },
    },
  },
  _count: { select: { bookings: true, reviews: true } },
} satisfies Prisma.TripInclude;

const tripDetailInclude = {
  center: {
    select: {
      id: true,
      name: true,
      city: true,
      contactPhone: true,
    },
  },
  instructor: {
    select: {
      id: true,
      name: true,
      instructorProfile: { select: { city: true } },
    },
  },
  reviews: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  _count: { select: { bookings: true, reviews: true } },
} satisfies Prisma.TripInclude;

function needsProviderApproval(actor?: CatalogActor) {
  return !actor || actor.role === "user";
}

function publicProviderWhere(): Prisma.TripWhereInput {
  return {
    OR: [
      { center: { status: "approved" } },
      { instructorId: { not: null } },
    ],
  };
}

async function getAll(filters: TripFilters) {
  const {
    city,
    difficulty,
    minPrice,
    maxPrice,
    search,
    centerId,
    instructorId,
    status,
    actor,
  } = filters;

  const where: Prisma.TripWhereInput = {
    ...catalogVisibilityWhere(actor, status),
    ...(needsProviderApproval(actor) && {
      AND: [publicProviderWhere()],
    }),
    ...(centerId !== undefined && { centerId }),
    ...(instructorId !== undefined && { instructorId }),
    ...(difficulty && { difficultyLevel: difficulty }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      pricePerPerson: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const trips = await prisma.trip.findMany({
    where,
    include: tripListInclude,
    orderBy: { scheduleDate: "asc" },
  });

  const normalizedSearch = search?.toLowerCase();

  return trips.filter((trip) => {
    const listingCity =
      trip.center?.city ?? trip.instructor?.instructorProfile?.city;
    const matchesCity = !city || listingCity === city;
    const matchesSearch =
      !normalizedSearch ||
      trip.title.toLowerCase().includes(normalizedSearch) ||
      trip.description?.toLowerCase().includes(normalizedSearch) ||
      listingCity?.toLowerCase().includes(normalizedSearch);

    return matchesCity && matchesSearch;
  });
}

async function getById(id: number, actor?: CatalogActor) {
  return prisma.trip.findFirst({
    where: {
      id,
      ...catalogDetailVisibilityWhere(actor),
      ...(needsProviderApproval(actor) && {
        AND: [publicProviderWhere()],
      }),
    },
    include: tripDetailInclude,
  });
}

async function create(
  actor: CatalogActor,
  data: TripCreateCommand,
) {
  const ownership = await resolveCatalogCreateOwnership(actor, {
    centerId: data.centerId,
    instructorId: data.instructorId,
  });

  const createData: Prisma.TripUncheckedCreateInput = {
    title: data.title,
    description: data.description,
    durationHours: data.durationHours,
    difficultyLevel: data.difficultyLevel,
    pricePerPerson: data.pricePerPerson,
    maxCapacity: data.maxCapacity,
    scheduleDate: data.scheduleDate,
    imageUrl: data.imageUrl,
    status: "approved",
    ...ownership,
  };

  return prisma.trip.create({ data: createData });
}

async function update(
  id: number,
  actor: CatalogActor,
  data: TripUpdateCommand,
) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      instructorId: true,
      center: { select: { ownerId: true } },
    },
  });

  if (!trip) {
    throw new HttpError(404, "Trip not found");
  }

  assertCatalogAccess(actor, trip);

  const {
    centerId,
    instructorId,
    ...fields
  } = data;
  const ownership =
    actor.role === "admin"
      ? await resolveCatalogUpdateOwnership({
          centerId,
          instructorId,
        })
      : {};
  const updateData: Prisma.TripUncheckedUpdateInput = {
    ...fields,
    ...ownership,
  };

  return prisma.trip.update({
    where: { id },
    data: updateData,
  });
}

async function remove(id: number, actor: CatalogActor) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      instructorId: true,
      center: { select: { ownerId: true } },
    },
  });

  if (!trip) {
    throw new HttpError(404, "Trip not found");
  }

  assertCatalogAccess(actor, trip);
  return prisma.trip.delete({ where: { id } });
}

export const tripsService = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
