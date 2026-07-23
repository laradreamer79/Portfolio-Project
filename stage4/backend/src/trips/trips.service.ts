import { HttpError } from "../utils/http-error.js";
import { prisma } from "../prisma/client.js";

type Actor = {
  id: number;
  role: string;
};

type TripCreateInput = {
  title: string;
  description?: string;
  durationHours: number;
  difficultyLevel: string;
  pricePerPerson: number;
  maxCapacity: number;
  scheduleDate: Date;
  centerId?: number;
  instructorId?: number;
  imageUrl?: string;
};

type TripUpdateInput = Partial<Omit<TripCreateInput, "centerId" | "instructorId">> & {
  centerId?: number | null;
  instructorId?: number | null;
};

async function resolveOwnedCenterId(actor: Actor, requestedCenterId?: number) {
  if (actor.role === "admin") {
    if (!requestedCenterId) {
      throw new HttpError(400, "centerId is required");
    }

    return requestedCenterId;
  }

  if (actor.role === "instructor") {
    if (!requestedCenterId) {
      throw new HttpError(400, "centerId is required");
    }

    const center = await prisma.divingCenter.findUnique({
      where: { id: requestedCenterId },
      select: { id: true },
    });

    if (!center) {
      throw new HttpError(404, "Diving center not found");
    }

    return center.id;
  }

  const ownedCenters = await prisma.divingCenter.findMany({
    where: { ownerId: actor.id },
    select: { id: true },
    orderBy: { id: "asc" },
  });

  if (ownedCenters.length === 0) {
    throw new HttpError(403, "No diving center is linked to this user");
  }

  if (requestedCenterId) {
    const ownsRequestedCenter = ownedCenters.some(
      (center) => center.id === requestedCenterId,
    );

    if (!ownsRequestedCenter) {
      throw new HttpError(403, "Forbidden");
    }

    return requestedCenterId;
  }

  if (ownedCenters.length > 1) {
    throw new HttpError(400, "centerId is required when the user owns multiple centers");
  }

  return ownedCenters[0].id;
}

function assertExactlyOneOwner(centerId?: number | null, instructorId?: number | null) {
  if (Boolean(centerId) === Boolean(instructorId)) {
    throw new HttpError(400, "Provide exactly one owner: centerId or instructorId");
  }
}

async function resolveCreateOwnership(actor: Actor, data: TripCreateInput) {
  if (actor.role === "admin") {
    assertExactlyOneOwner(data.centerId, data.instructorId);

    if (data.centerId) {
      await resolveOwnedCenterId(actor, data.centerId);
    }

    return {
      centerId: data.centerId,
      instructorId: data.instructorId,
    };
  }

  if (actor.role === "instructor") {
    return {
      centerId: undefined,
      instructorId: actor.id,
    };
  }

  return {
    centerId: await resolveOwnedCenterId(actor, data.centerId),
    instructorId: undefined,
  };
}

async function resolveAdminUpdateOwnership(data: TripUpdateInput) {
  if (data.centerId === undefined && data.instructorId === undefined) {
    return data;
  }

  assertExactlyOneOwner(data.centerId, data.instructorId);

  if (data.centerId) {
    await resolveOwnedCenterId({ id: 0, role: "admin" }, data.centerId);
    data.instructorId = null;
  } else {
    data.centerId = null;
  }

  return data;
}

function tripOwnerWhere(actor: Actor) {
  if (actor.role === "instructor") {
    return { instructorId: actor.id };
  }

  if (actor.role === "diving_center") {
    return { center: { ownerId: actor.id } };
  }

  return {};
}

function tripVisibilityWhere(actor: Actor | undefined, status?: string) {
  if (status === "all") {
    if (!actor) {
      return { status: "approved" as const };
    }

    if (actor.role === "admin") {
      return {};
    }

    return tripOwnerWhere(actor);
  }

  if (!status || status === "approved") {
    return { status: "approved" as const };
  }

  if (!actor) {
    return { status: "approved" as const };
  }

  if (actor.role === "admin") {
    return { status: status as any };
  }

  return {
    status: status as any,
    ...tripOwnerWhere(actor),
  };
}

function tripDetailVisibilityWhere(actor: Actor | undefined) {
  if (!actor) {
    return { status: "approved" as const };
  }

  if (actor.role === "admin") {
    return {};
  }

  return {
    OR: [
      { status: "approved" as const },
      tripOwnerWhere(actor),
    ],
  };
}

async function assertTripAccess(id: number, actor: Actor) {
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

  if (actor.role === "admin") {
    return;
  }

  if (actor.role === "instructor" && trip.instructorId === actor.id) {
    return;
  }

  if (actor.role === "diving_center" && trip.center?.ownerId === actor.id) {
    return;
  }

  throw new HttpError(403, "Forbidden");
}

export const tripsService = {
  async getAll(filters: {
    city?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    centerId?: number;
    instructorId?: number;
    status?: string;
    actor?: Actor;
  }) {
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
    return prisma.trip.findMany({
      where: {
        ...tripVisibilityWhere(actor, status),
        ...(centerId !== undefined && { centerId }),
        ...(instructorId !== undefined && { instructorId }),
        ...(difficulty && { difficultyLevel: difficulty as any }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          pricePerPerson: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }),
        ...(city && {
          OR: [
            { center: { city: { equals: city, mode: "insensitive" } } },
            {
              instructor: {
                instructorProfile: {
                  city: { equals: city, mode: "insensitive" },
                },
              },
            },
          ],
        }),
        ...(search && {
          AND: [
            {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            },
          ],
        }),
      },
      include: {
        center: { select: { id: true, name: true, city: true } },
        instructor: {
          select: {
            id: true,
            name: true,
            instructorProfile: { select: { city: true } },
          },
        },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { scheduleDate: "asc" },
    });
  },

  async getById(id: number, actor?: Actor) {
    return prisma.trip.findFirst({
      where: {
        id,
        ...tripDetailVisibilityWhere(actor),
      },
      include: {
        center: { select: { id: true, name: true, city: true, contactPhone: true } },
        instructor: {
          select: {
            id: true,
            name: true,
            instructorProfile: { select: { city: true } },
          },
        },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { bookings: true, reviews: true } },
      },
    });
  },

  async create(actor: Actor, data: TripCreateInput) {
    const { centerId, instructorId } = await resolveCreateOwnership(actor, data);

    return prisma.trip.create({
      data: {
        title: data.title,
        description: data.description,
        durationHours: data.durationHours,
        difficultyLevel: data.difficultyLevel as any,
        pricePerPerson: data.pricePerPerson,
        maxCapacity: data.maxCapacity,
        scheduleDate: data.scheduleDate,
        centerId,
        instructorId,
        imageUrl: data.imageUrl,
        status: "approved",
      } as any,
    });
  },

  async update(id: number, actor: Actor, data: TripUpdateInput) {
    await assertTripAccess(id, actor);

    const nextData: TripUpdateInput = { ...data };

    if (actor.role !== "admin") {
      delete nextData.centerId;
      delete nextData.instructorId;
    } else {
      await resolveAdminUpdateOwnership(nextData);
    }

    return prisma.trip.update({
      where: { id },
      data: nextData as any,
    });
  },

  async delete(id: number, actor: Actor) {
    await assertTripAccess(id, actor);

    return prisma.trip.delete({ where: { id } });
  },
};
