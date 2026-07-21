import { z } from "zod";

const requiredString = z.string().trim().min(1);
const id = z.coerce.number().int().positive();
const money = z.coerce.number().nonnegative();
const positiveInt = z.coerce.number().int().positive();
const date = z.coerce.date();
export const tripCreateSchema = z
  .object({
    title: requiredString,
    description: requiredString,
    durationHours: positiveInt, 
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
    pricePerPerson: money,
    maxCapacity: positiveInt,
    scheduleDate: date,
    centerId: id.optional(),
    instructorId: id.optional(),
  })
  .strict();

export const tripUpdateSchema = tripCreateSchema.partial().strict();

export const courseCreateSchema = z
  .object({
    title: requiredString,
    description: requiredString,
    level: requiredString,
    price: money,
    startDate: date,
    centerId: id.optional(),
    instructorId: id.optional(),
  })
  .strict();

export const courseUpdateSchema = courseCreateSchema.partial().strict();
