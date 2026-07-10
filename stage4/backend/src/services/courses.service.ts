import { prisma } from "../prisma/client.js";

export const coursesService = {
  async getAll(filters: {
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    centerId?: number;
    city?: string;
  }) {
    const { level, minPrice, maxPrice, search, centerId, city } = filters;

    return prisma.course.findMany({
      where: {
        status: "approved",
        ...(centerId && { centerId }),
        ...(level && { level: { contains: level, mode: "insensitive" } }),
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
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
      orderBy: { startDate: "asc" },
    });
  },

  async getById(id: number) {
    return prisma.course.findUnique({
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

  async create(data: {
    title: string;
    description?: string;
    level: string;
    price: number;
    startDate: Date;
    centerId: number;
    instructorId?: number;
    imageUrl?: string;
  }) {
    return prisma.course.create({ data: data as any });
  },

  async update(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      level: string;
      price: number;
      startDate: Date;
      imageUrl: string;
    }>
  ) {
    return prisma.course.update({
      where: { id },
      data: data as any,
    });
  },

  async delete(id: number) {
    return prisma.course.delete({ where: { id } });
  },
};