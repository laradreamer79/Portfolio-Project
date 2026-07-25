import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Center, Trip } from "../../data";
import { ApiError } from "../../lib/apiClient";
import {
  getCourseById,
  getTripById,
  isPastExperience,
} from "../catalog";
import {
  createMoyasarToken,
  createPayment,
  MoyasarTokenError,
  type ApiPayment,
} from "../payments";
import { useAuth } from "../../hooks/useAuth";
import { createBooking, type ApiBooking } from "./bookingService";
import {
  validateBookingDetails,
  validatePaymentDetails,
} from "./bookingValidation";

export type BookingStep = "details" | "payment" | "success";
export type BookingExperienceType = "trip" | "course";

export type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type PaymentFormState = {
  card: string;
  expiry: string;
  cvv: string;
  holder: string;
};

function bookingPhoneStorageKey(userId: number) {
  return `oyster_booking_phone_${userId}`;
}

function isExperienceType(
  value: string | undefined,
): value is BookingExperienceType {
  return value === "trip" || value === "course";
}

export function useBookingFlow() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [experience, setExperience] = useState<Trip | null>(null);
  const [center, setCenter] = useState<Center | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState<BookingStep>("details");
  const [divers, setDivers] = useState(1);
  const [form, setForm] = useState<BookingFormState>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentFormState>({
    card: "",
    expiry: "",
    cvv: "",
    holder: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ApiBooking | null>(
    null,
  );
  const [confirmedPayment, setConfirmedPayment] = useState<ApiPayment | null>(
    null,
  );

  const experienceType = isExperienceType(type) ? type : undefined;
  const experienceId = Number(id);

  useEffect(() => {
    if (!user) return;

    const savedPhone =
      window.localStorage.getItem(bookingPhoneStorageKey(user.id)) ?? "";

    setForm((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone || savedPhone,
    }));
  }, [user]);

  useEffect(() => {
    if (!experienceType || !Number.isInteger(experienceId)) {
      setLoadError("This booking link is invalid.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setLoadError(null);

    const request =
      experienceType === "course"
        ? getCourseById(experienceId, token)
        : getTripById(experienceId, token);

    request
      .then((data) => {
        if (!active) return;

        if (experienceType === "course" && "course" in data) {
          setExperience(data.course);
          setCenter(data.center);
        } else if (experienceType === "trip" && "trip" in data) {
          setExperience(data.trip);
          setCenter(data.center);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;

        setLoadError(
          err instanceof Error ? err.message : "Unable to load this listing.",
        );
        setExperience(null);
        setCenter(undefined);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [experienceType, experienceId, token]);

  const total = experience ? experience.price * divers : 0;
  const past = experience ? isPastExperience(experience) : false;
  const steps: BookingStep[] = ["details", "payment", "success"];
  const stepIdx = steps.indexOf(step);

  const setFormField =
    (key: keyof BookingFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValidationError(null);
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  const setPaymentField =
    (key: keyof PaymentFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setSubmitError(null);
      setPayment((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };

  const setPaymentValue = (key: keyof PaymentFormState, value: string) => {
    setSubmitError(null);
    setPayment((current) => ({
      ...current,
      [key]: value,
    }));
  };

  function handleDetailsContinue() {
    const error = validateBookingDetails(form);
    setValidationError(error);

    if (!error && !past) {
      if (user) {
        window.localStorage.setItem(
          bookingPhoneStorageKey(user.id),
          form.phone,
        );
      }
      setStep("payment");
    }
  }

  async function handlePay() {
    if (isSubmitting || !experienceType || !Number.isInteger(experienceId)) {
      return;
    }

    const paymentError = validatePaymentDetails(payment);
    if (paymentError) {
      setSubmitError(paymentError);
      return;
    }

    if (!token) {
      navigate("/auth", {
        state: { from: `/booking/${experienceType}/${experienceId}` },
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const sourceToken = await createMoyasarToken(payment);

      const booking = await createBooking(
        {
          ...(experienceType === "course"
            ? { courseId: experienceId }
            : { tripId: experienceId }),
          numberOfPeople: divers,
        },
        token,
      );

      const paymentResult = await createPayment(
        {
          bookingId: booking.id,
          paymentMethod: "creditcard",
          sourceToken,
        },
        token,
      );

      if (paymentResult.transactionUrl) {
        sessionStorage.setItem(
          "oyster_pending_payment_id",
          String(paymentResult.payment.id),
        );
        window.location.assign(paymentResult.transactionUrl);
        return;
      }

      setConfirmedBooking(booking);
      setConfirmedPayment(paymentResult.payment);
      setStep("success");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError || err instanceof MoyasarTokenError
          ? err.message
          : "Unable to complete this booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    center,
    confirmedBooking,
    confirmedPayment,
    divers,
    experience,
    experienceId,
    experienceType,
    form,
    handlePay,
    handleDetailsContinue,
    isSubmitting,
    loading,
    loadError,
    navigate,
    past,
    payment,
    setDivers,
    setFormField,
    setPaymentField,
    setPaymentValue,
    setStep,
    step,
    stepIdx,
    submitError,
    total,
    validationError,
  };
}
