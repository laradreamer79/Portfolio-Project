import { HttpError } from "../utils/http-error.js";
import type { CatalogActor } from "../common/catalog/catalog-ownership.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import type { CenterQueryInput } from "./centers.validation.js";
import {
  DIVING_CITIES,
  type DivingCity,
} from "../common/constants/diving-cities.js";

async function assertCenterAccess(id: number, actor: CatalogActor) {
  const center = await prisma.divingCenter.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!center) {
    throw new HttpError(404, "Diving center not found");
  }

  if (actor.role !== "admin" && center.ownerId !== actor.id) {
    throw new HttpError(403, "Forbidden");
  }
}

function canReadAllStatuses(actor: CatalogActor | undefined, ownerId?: number) {
  if (!actor) {
    return false;
  }

  return actor.role === "admin" || ownerId === actor.id;
}

function centerVisibilityWhere(
  actor: CatalogActor | undefined,
): Prisma.DivingCenterWhereInput {
  if (!actor) {
    return { status: "approved" as const };
  }

  if (actor.role === "admin") {
    return {};
  }

  return {
    OR: [{ status: "approved" as const }, { ownerId: actor.id }],
  };
}

export const centersService = {
  async getAll(
    filters: CenterQueryInput & { actor?: CatalogActor },
  ) {
    const { city, search, status, ownerId, actor } = filters;
    const allowAllStatuses = status === "all" && canReadAllStatuses(actor, ownerId);
    const matchingCities = search
      ? DIVING_CITIES.filter((candidate) =>
          candidate.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
    const where: Prisma.DivingCenterWhereInput = {
      ...(allowAllStatuses ? {} : centerVisibilityWhere(actor)),
      ...(ownerId !== undefined && { ownerId }),
      ...(city && { city }),
      ...(search && {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              ...(matchingCities.length > 0
                ? [{ city: { in: [...matchingCities] } }]
                : []),
            ],
          },
        ],
      }),
      ...(status && status !== "all" && { status }),
    };

    return prisma.divingCenter.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { trips: true, courses: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number, actor?: CatalogActor) {
    return prisma.divingCenter.findFirst({
      where: {
        id,
        ...centerVisibilityWhere(actor),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        trips: { where: { status: "approved" }, orderBy: { scheduleDate: "asc" } },
        courses: { where: { status: "approved" }, orderBy: { startDate: "asc" } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { trips: true, courses: true, reviews: true } },
      },
    });
  },

  async create(data: {
    name: string;
    city: DivingCity;
    address?: string;
    licenseNumber: string;
    description?: string;
    priceRange?: string;
    contactEmail?: string;
    contactPhone?: string;
    ownerId: number;
    imageUrl?: string;
  }) {
    return prisma.divingCenter.create({ data });
  },

  async update(
    id: number,
    actor: CatalogActor,
    data: Partial<{
      name: string;
      city: DivingCity;
      address: string;
      description: string;
      priceRange: string;
      contactEmail: string;
      contactPhone: string;
      imageUrl: string;
      status: "pending" | "approved" | "rejected";
    }>
  ) {
    await assertCenterAccess(id, actor);

    const nextData = { ...data };

    if (actor.role !== "admin") {
      delete nextData.status;
    }

    return prisma.divingCenter.update({
      where: { id },
      data: nextData,
    });
  },

  async delete(id: number) {
    return prisma.divingCenter.delete({ where: { id } });
  },
};
