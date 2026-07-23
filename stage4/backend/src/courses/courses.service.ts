import { HttpError } from "../utils/http-error.js";
import { prisma } from "../prisma/client.js";

type Actor = {
  id: number;
  role: string;
};

type CourseCreateInput = {
  title: string;
  description?: string;
  level: string;
  price: number;
  startDate: Date;
  centerId?: number;
  instructorId?: number;
  imageUrl?: string;
};

type CourseUpdateInput = Partial<Omit<CourseCreateInput, "centerId" | "instructorId">> & {
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

async function resolveCreateOwnership(actor: Actor, data: CourseCreateInput) {
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

async function resolveAdminUpdateOwnership(data: CourseUpdateInput) {
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

function courseOwnerWhere(actor: Actor) {
  if (actor.role === "instructor") {
    return { instructorId: actor.id };
  }

  if (actor.role === "diving_center") {
    return { center: { ownerId: actor.id } };
  }

  return {};
}

function courseVisibilityWhere(actor: Actor | undefined, status?: string) {
  if (status === "all") {
    if (!actor) {
      return { status: "approved" as const };
    }

    if (actor.role === "admin") {
      return {};
    }

    return courseOwnerWhere(actor);
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
    ...courseOwnerWhere(actor),
  };
}

function courseDetailVisibilityWhere(actor: Actor | undefined) {
  if (!actor) {
    return { status: "approved" as const };
  }

  if (actor.role === "admin") {
    return {};
  }

  return {
    OR: [
      { status: "approved" as const },
      courseOwnerWhere(actor),
    ],
  };
}

async function assertCourseAccess(id: number, actor: Actor) {
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      instructorId: true,
      center: { select: { ownerId: true } },
    },
  });

  if (!course) {
    throw new HttpError(404, "Course not found");
  }

  if (actor.role === "admin") {
    return;
  }

  if (actor.role === "instructor" && course.instructorId === actor.id) {
    return;
  }

  if (actor.role === "diving_center" && course.center?.ownerId === actor.id) {
    return;
  }

  throw new HttpError(403, "Forbidden");
}

export const coursesService = {
  async getAll(filters: {
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    centerId?: number;
    city?: string;
    instructorId?: number;
    status?: string;
    actor?: Actor;
  }) {
    const {
      level,
      minPrice,
      maxPrice,
      search,
      centerId,
      city,
      instructorId,
      status,
      actor,
    } = filters;

    return prisma.course.findMany({
      where: {
        ...courseVisibilityWhere(actor, status),
        ...(centerId !== undefined && { centerId }),
        ...(instructorId !== undefined && { instructorId }),
        ...(level && { level: { contains: level, mode: "insensitive" } }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          price: {
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
      orderBy: { startDate: "asc" },
    });
  },

  async getById(id: number, actor?: Actor) {
    return prisma.course.findFirst({
      where: {
        id,
        ...courseDetailVisibilityWhere(actor),
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

  async create(actor: Actor, data: CourseCreateInput) {
    const { centerId, instructorId } = await resolveCreateOwnership(actor, data);

    return prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        price: data.price,
        startDate: data.startDate,
        centerId,
        instructorId,
        imageUrl: data.imageUrl,
        status: "approved",
      } as any,
    });
  },

  async update(id: number, actor: Actor, data: CourseUpdateInput) {
    await assertCourseAccess(id, actor);

    const nextData: CourseUpdateInput = { ...data };

    if (actor.role !== "admin") {
      delete nextData.centerId;
      delete nextData.instructorId;
    } else {
      await resolveAdminUpdateOwnership(nextData);
    }

    return prisma.course.update({
      where: { id },
      data: nextData as any,
    });
  },

  async delete(id: number, actor: Actor) {
    await assertCourseAccess(id, actor);

    return prisma.course.delete({ where: { id } });
  },
};
