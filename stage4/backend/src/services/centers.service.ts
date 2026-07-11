import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";

type Actor = {
  id: number;
  role: string;
};

async function assertCenterAccess(id: number, actor: Actor) {
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

function canReadAllStatuses(actor: Actor | undefined, ownerId?: number) {
  if (!actor) {
    return false;
  }

  return actor.role === "admin" || ownerId === actor.id;
}

function centerVisibilityWhere(actor: Actor | undefined) {
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
  async getAll(filters: {
    city?: string;
    search?: string;
    status?: string;
    ownerId?: number;
    actor?: Actor;
  }) {
    const { city, search, status, ownerId, actor } = filters;
    const allowAllStatuses = status === "all" && canReadAllStatuses(actor, ownerId);

    return prisma.divingCenter.findMany({
      where: {
        ...(allowAllStatuses ? {} : centerVisibilityWhere(actor)),
        ...(ownerId !== undefined && { ownerId }),
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && status !== "all" && { status: status as any }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { trips: true, courses: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number, actor?: Actor) {
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
    city: string;
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
    actor: Actor,
    data: Partial<{
      name: string;
      city: string;
      address: string;
      description: string;
      priceRange: string;
      contactEmail: string;
      contactPhone: string;
      imageUrl: string;
    }>
  ) {
    await assertCenterAccess(id, actor);

    return prisma.divingCenter.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.divingCenter.delete({ where: { id } });
  },
};
