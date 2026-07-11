import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";

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

type TripUpdateInput = Partial<TripCreateInput>;

async function resolveCenterId(actor: Actor, requestedCenterId?: number) {
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

  if (actor.role === "diving_center" && trip.center.ownerId === actor.id) {
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
    } = filters;
    return prisma.trip.findMany({
      where: {
        ...(status !== "all" && { status: (status as any) ?? "approved" }),
        ...(centerId !== undefined && { centerId }),
        ...(instructorId !== undefined && { instructorId }),
        ...(difficulty && { difficultyLevel: difficulty as any }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          pricePerPerson: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }),
        ...(city && { center: { city: { contains: city, mode: "insensitive" } } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        center: { select: { id: true, name: true, city: true } },
        instructor: { select: { id: true, name: true } },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { scheduleDate: "asc" },
    });
  },

  async getById(id: number) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        center: { select: { id: true, name: true, city: true, contactPhone: true } },
        instructor: { select: { id: true, name: true } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { bookings: true, reviews: true } },
      },
    });
  },

  async create(actor: Actor, data: TripCreateInput) {
    const centerId = await resolveCenterId(actor, data.centerId);
    const instructorId =
      actor.role === "admin"
        ? data.instructorId
        : actor.role === "instructor"
          ? actor.id
          : undefined;

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
      },
    });
  },

  async update(id: number, actor: Actor, data: TripUpdateInput) {
    await assertTripAccess(id, actor);

    const nextData: TripUpdateInput = { ...data };

    if (actor.role !== "admin") {
      delete nextData.centerId;
      delete nextData.instructorId;
    } else if (nextData.centerId !== undefined) {
      nextData.centerId = await resolveCenterId(actor, nextData.centerId);
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
