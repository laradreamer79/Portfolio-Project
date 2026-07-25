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
  CourseCreateInput,
  CourseQueryInput,
  CourseUpdateInput,
} from "./courses.validation.js";

type CourseCreateCommand = CourseCreateInput & {
  imageUrl?: string;
};

type CourseUpdateCommand = CourseUpdateInput & {
  imageUrl?: string;
};

type CourseFilters = CourseQueryInput & {
  actor?: CatalogActor;
};

const courseListInclude = {
  center: { select: { id: true, name: true, city: true } },
  instructor: {
    select: {
      id: true,
      name: true,
      instructorProfile: { select: { city: true } },
    },
  },
  _count: { select: { bookings: true, reviews: true } },
} satisfies Prisma.CourseInclude;

const courseDetailInclude = {
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
} satisfies Prisma.CourseInclude;

async function getAll(filters: CourseFilters) {
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

  const where: Prisma.CourseWhereInput = {
    ...catalogVisibilityWhere(actor, status),
    ...(centerId !== undefined && { centerId }),
    ...(instructorId !== undefined && { instructorId }),
    ...(level && {
      level: { contains: level, mode: "insensitive" },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    ...(city && {
      OR: [
        { center: { city: { equals: city } } },
        {
          instructor: {
            instructorProfile: {
              city: { equals: city },
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
  };

  return prisma.course.findMany({
    where,
    include: courseListInclude,
    orderBy: { startDate: "asc" },
  });
}

async function getById(id: number, actor?: CatalogActor) {
  return prisma.course.findFirst({
    where: {
      id,
      ...catalogDetailVisibilityWhere(actor),
    },
    include: courseDetailInclude,
  });
}

async function create(
  actor: CatalogActor,
  data: CourseCreateCommand,
) {
  const ownership = await resolveCatalogCreateOwnership(actor, {
    centerId: data.centerId,
    instructorId: data.instructorId,
  });

  const createData: Prisma.CourseUncheckedCreateInput = {
    title: data.title,
    description: data.description,
    level: data.level,
    price: data.price,
    startDate: data.startDate,
    imageUrl: data.imageUrl,
    status: "approved",
    ...ownership,
  };

  return prisma.course.create({ data: createData });
}

async function update(
  id: number,
  actor: CatalogActor,
  data: CourseUpdateCommand,
) {
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

  assertCatalogAccess(actor, course);

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
  const updateData: Prisma.CourseUncheckedUpdateInput = {
    ...fields,
    ...ownership,
  };

  return prisma.course.update({
    where: { id },
    data: updateData,
  });
}

async function remove(id: number, actor: CatalogActor) {
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

  assertCatalogAccess(actor, course);
  return prisma.course.delete({ where: { id } });
}

export const coursesService = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
