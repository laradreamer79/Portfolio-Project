import {
  imageValidationError,
  isTodayOrFuture,
} from "../../lib/validation";

export type ListingForm = {
  title: string;
  type: string;
  level: string;
  price: string;
  duration: string;
  depth: string;
  date: string;
  slots: string;
  description: string;
};

type ListingValidationOptions = {
  image: File | null;
  requiresImage: boolean;
  originalDate?: string;
};

type ListingValidationResult =
  | { ok: false; error: string }
  | {
      ok: true;
      data: {
        title: string;
        description: string;
        price: number;
        slots: number;
        date: string;
      };
    };

export function validateListingImage(file: File) {
  return imageValidationError(file);
}

export function validateListingForm(
  form: ListingForm,
  options: ListingValidationOptions,
): ListingValidationResult {
  const title = form.title.trim();
  const description = form.description.trim();
  const price = Number(form.price);
  const slots = Number(form.slots);

  if (!title) return { ok: false, error: "Enter a title." };
  if (!description) return { ok: false, error: "Enter a description." };

  if (!form.price || !Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Enter a valid non-negative price." };
  }

  if (
    form.type === "trip" &&
    (!form.slots || !Number.isInteger(slots) || slots <= 0)
  ) {
    return { ok: false, error: "Enter a positive whole number of spots." };
  }

  if (!form.date) return { ok: false, error: "Choose a date." };

  if (form.date !== options.originalDate && !isTodayOrFuture(form.date)) {
    return { ok: false, error: "Choose today or a future date." };
  }

  if (options.requiresImage && !options.image) {
    return { ok: false, error: "Upload an image before publishing." };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      price,
      slots,
      date: form.date,
    },
  };
}
