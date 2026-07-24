import { z } from "zod";

export const saudiPhoneSchema = z
  .string()
  .trim()
  .regex(
    /^05\d{8}$/,
    "Phone number must contain 10 digits and start with 05.",
  );
