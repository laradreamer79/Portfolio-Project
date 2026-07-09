import { prisma } from "../prisma/client.js";

export const tripsService = {
  async getAll(filters: {
    city?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    centerId?: number;
  }) {
    const { city, difficulty, minPrice, maxPrice, search, centerId } = filters;
    return prisma.trip.findMany({
      where: {
        status: "approved",
        ...(centerId && { centerId }),
        ...(difficulty && { difficultyLevel: difficulty as any }),
        ...(minPrice && { pricePerPerson: { gte: minPrice } }),
        ...(maxPrice && { pricePerPerson: { lte: maxPrice } }),
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

  async create(data: {
    title: string;
    description?: string;
    durationHours: number;
    difficultyLevel: string;
    pricePerPerson: number;
    maxCapacity: number;
    scheduleDate: Date;
    centerId: number;
    instructorId?: number;
  }) {
    return prisma.trip.create({ data: data as any });
  },

  async update(id: number, data: Partial<{
    title: string;
    description: string;
    durationHours: number;
    difficultyLevel: string;
    pricePerPerson: number;
    maxCapacity: number;
    scheduleDate: Date;
  }>) {
    return prisma.trip.update({ where: { id }, data: data as any });
  },

  async delete(id: number) {
    return prisma.trip.delete({ where: { id } });
  },
};