import { prisma } from "../prisma/client.js";

export const centersService = {
  async getAll(filters: {
    city?: string;
    search?: string;
    status?: string;
  }) {
    const { city, search, status } = filters;

    return prisma.divingCenter.findMany({
      where: {
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        status: status === "all" ? undefined : (status as any) ?? "approved",
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { trips: true, courses: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.divingCenter.findUnique({
      where: { id },
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
    return prisma.divingCenter.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.divingCenter.delete({ where: { id } });
  },
};