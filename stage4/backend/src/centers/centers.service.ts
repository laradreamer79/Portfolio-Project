import { HttpError } from "../utils/http-error.js";
import type { CatalogActor } from "../common/catalog/catalog-ownership.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import type { CenterQueryInput } from "./centers.validation.js";

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

function averageRating(
  reviews: Array<{ rating: number }>,
) {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
}

export const centersService = {
  async getAll(
    filters: CenterQueryInput & { actor?: CatalogActor },
  ) {
    const { city, search, status, ownerId, actor } = filters;
    const allowAllStatuses = status === "all" && canReadAllStatuses(actor, ownerId);
    const where: Prisma.DivingCenterWhereInput = {
      ...(allowAllStatuses ? {} : centerVisibilityWhere(actor)),
      ...(ownerId !== undefined && { ownerId }),
      ...(city && { city: { equals: city, mode: "insensitive" } }),
      ...(search && {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      }),
      ...(status && status !== "all" && { status }),
    };

    const centers = await prisma.divingCenter.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { trips: true, courses: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (centers.length === 0) return [];

    const ratings = await prisma.review.groupBy({
      by: ["centerId"],
      where: {
        centerId: { in: centers.map((center) => center.id) },
      },
      _avg: { rating: true },
    });
    const ratingByCenter = new Map(
      ratings.map((rating) => [
        rating.centerId,
        Number((rating._avg.rating ?? 0).toFixed(1)),
      ]),
    );

    return centers.map((center) => ({
      ...center,
      rating: ratingByCenter.get(center.id) ?? 0,
    }));
  },

  async getById(id: number, actor?: CatalogActor) {
    const center = await prisma.divingCenter.findFirst({
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

    if (!center) return null;

    return {
      ...center,
      rating: averageRating(center.reviews),
    };
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
    actor: CatalogActor,
    data: Partial<{
      name: string;
      city: string;
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
