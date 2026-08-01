import { useEffect, useState, type ChangeEvent } from "react";
import type { Trip } from "../../data";
import {
  decimalOnly,
  digitsOnly,
  type FieldErrors,
} from "../../lib/validation";
import {
  validateListingForm,
  validateListingImage,
  type ListingForm,
} from "./listingValidation";
import {
  createCourse,
  createTrip,
  deleteCourse,
  deleteTrip,
  getCourses,
  getTrips,
  updateCourse,
  updateTrip,
} from "../catalog";

const EMPTY_FORM: ListingForm = {
  title: "",
  type: "trip",
  level: "Open Water",
  price: "",
  duration: "Full Day",
  depth: "",
  date: "",
  slots: "",
  description: "",
};

type UseListingManagementOptions = {
  token: string | null;
  defaultSlots: number;
  onEditComplete?: () => void;
};

function durationLabel(duration: string) {
  if (duration.includes("4")) return "Half Day";
  if (duration.includes("3")) return "Evening";
  if (duration.includes("24")) return "Multi-Day";
  return "Full Day";
}

function durationHours(duration: string) {
  switch (duration) {
    case "Half Day":
      return 4;
    case "Evening":
      return 3;
    case "Multi-Day":
      return 24;
    default:
      return 8;
  }
}

function difficultyLevel(level: string) {
  if (level === "Advanced") return "advanced";
  if (level === "Intermediate") return "intermediate";
  return "beginner";
}

export function listingRoute(listing: Trip) {
  return listing.type === "course"
    ? `/courses/${listing.id}`
    : `/trips/${listing.id}`;
}

export function useListingManagement({
  token,
  defaultSlots,
  onEditComplete,
}: UseListingManagementOptions) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [listings, setListings] = useState<Trip[]>([]);
  const [form, setForm] = useState<ListingForm>(EMPTY_FORM);
  const [postDone, setPostDone] = useState(false);
  const [postFieldErrors, setPostFieldErrors] = useState<
    FieldErrors<keyof ListingForm | "image">
  >({});
  const [postError, setPostError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [editingListing, setEditingListing] = useState<Trip | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const authToken = token;

    async function loadListings() {
      try {
        const [trips, courses] = await Promise.all([
          getTrips({ status: "all" }, authToken),
          getCourses({ status: "all" }, authToken),
        ]);
        if (active) setListings([...trips, ...courses]);
      } catch {
        if (active) setListings([]);
      }
    }

    void loadListings();

    return () => {
      active = false;
    };
  }, [token]);

  const setFormField =
    (key: keyof ListingForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setPostFieldErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
      setForm((current) => ({
        ...current,
        [key]:
          key === "price"
            ? decimalOnly(event.target.value)
            : key === "slots"
              ? digitsOnly(event.target.value)
              : event.target.value,
      }));
    };

  function resetForm() {
    setForm(EMPTY_FORM);
    setImage(null);
    setPostDone(false);
    setPostFieldErrors({});
    setPostError(null);
    setIsPosting(false);
    setEditingListing(null);
  }

  function openCreateModal() {
    resetForm();
    setShowPostModal(true);
  }

  function openEditModal(listing: Trip) {
    setEditingListing(listing);
    setForm({
      title: listing.title,
      type: listing.type,
      level: listing.level,
      price: String(listing.price),
      duration: durationLabel(listing.duration),
      depth:
        listing.depth === "Training" || listing.depth === "Varies"
          ? ""
          : listing.depth,
      date: listing.rawDate?.slice(0, 10) ?? "",
      slots: listing.slots ? String(listing.slots) : "",
      description: listing.description,
    });
    setImage(null);
    setPostDone(false);
    setPostError(null);
    setShowPostModal(true);
  }

  function closePostModal() {
    setShowPostModal(false);
    resetForm();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPostError(null);
    setPostFieldErrors((current) => ({
      ...current,
      image: undefined,
    }));

    if (!file) {
      setImage(null);
      return;
    }

    const error = validateListingImage(file);
    if (error) {
      setImage(null);
      setPostFieldErrors((current) => ({
        ...current,
        image: error,
      }));
      event.target.value = "";
      return;
    }

    setImage(file);
  }

  async function handlePostSubmit() {
    const validation = validateListingForm(form, {
      image,
      requiresImage: !editingListing,
      originalDate: editingListing?.rawDate?.slice(0, 10),
    });

    if (!validation.ok) {
      setPostFieldErrors(validation.errors);
      return;
    }

    const { title, description, price, slots, date } = validation.data;

    if (!token) {
      setPostError("You need to sign in again before posting.");
      return;
    }

    setIsPosting(true);
    setPostFieldErrors({});
    setPostError(null);

    try {
      const tripSlots = form.type === "trip" ? slots : defaultSlots;

      if (editingListing) {
        const updatedListing =
          editingListing.type === "course"
            ? await updateCourse(
                editingListing.id,
                {
                  title,
                  description,
                  level: form.level,
                  price,
                  startDate: date,
                  image,
                },
                token,
              )
            : await updateTrip(
                editingListing.id,
                {
                  title,
                  description,
                  durationHours: durationHours(form.duration),
                  difficultyLevel: difficultyLevel(form.level),
                  pricePerPerson: price,
                  maxCapacity: tripSlots,
                  scheduleDate: date,
                  image,
                },
                token,
              );

        setListings((current) =>
          current.map((listing) =>
            listing.id === editingListing.id &&
            listing.type === editingListing.type
              ? updatedListing
              : listing,
          ),
        );
        closePostModal();
        onEditComplete?.();
        return;
      }

      const createdListing =
        form.type === "course"
          ? await createCourse(
              {
                title,
                description,
                level: form.level,
                price,
                startDate: date,
                image: image!,
              },
              token,
            )
          : await createTrip(
              {
                title,
                description,
                durationHours: durationHours(form.duration),
                difficultyLevel: difficultyLevel(form.level),
                pricePerPerson: price,
                maxCapacity: tripSlots,
                scheduleDate: date,
                image: image!,
              },
              token,
            );

      setListings((current) => [createdListing, ...current]);
      setForm(EMPTY_FORM);
      setImage(null);
      setPostDone(true);
    } catch (error) {
      setPostError(
        error instanceof Error
          ? error.message
          : "Unable to publish this listing. Please try again.",
      );
    } finally {
      setIsPosting(false);
    }
  }

  async function handleDeleteListing(listing: Trip) {
    if (!token) {
      setPostError("You need to sign in again before deleting.");
      return;
    }

    if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) {
      return;
    }

    setPostError(null);

    try {
      if (listing.type === "course") {
        await deleteCourse(listing.id, token);
      } else {
        await deleteTrip(listing.id, token);
      }

      setListings((current) =>
        current.filter(
          (item) => item.id !== listing.id || item.type !== listing.type,
        ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete this listing. Please try again.",
      );
    }
  }

  return {
    closePostModal,
    editingListing,
    form,
    handleDeleteListing,
    handleImageChange,
    handlePostSubmit,
    image,
    isPosting,
    listings,
    openCreateModal,
    openEditModal,
    postDone,
    postFieldErrors,
    postError,
    setFormField,
    showPostModal,
  };
}
