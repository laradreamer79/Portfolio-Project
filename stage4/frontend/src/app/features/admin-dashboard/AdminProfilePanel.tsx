import { useEffect, useState, type SubmitEvent } from "react";
import { Mail, Save, UserRound } from "lucide-react";
import { FormFieldError } from "../../components/FormFieldError";
import {
  zodFieldErrors,
  type FieldErrors,
} from "../../lib/validation";
import type { AdminProfile } from "./adminService";
import {
  updateAdminProfileSchema,
  type UpdateAdminProfileInput,
} from "./adminValidation";

type AdminProfilePanelProps = {
  profile: AdminProfile | null;
  error: string | null;
  isSaving: boolean;
  onSave: (data: UpdateAdminProfileInput) => Promise<void>;
};

export function AdminProfilePanel({
  profile,
  error,
  isSaving,
  onSave,
}: AdminProfilePanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof UpdateAdminProfileInput>
  >({});

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setFieldErrors({});
  }, [profile]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = updateAdminProfileSchema.safeParse({ name, email });

    if (!result.success) {
      setFieldErrors(zodFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
    void onSave(result.data);
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">
        {error ?? "Loading admin profile..."}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
          ADMIN PROFILE
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your account name and email address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="admin-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500">
            <UserRound className="h-4 w-4 text-slate-400" />
            <input
              id="admin-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  name: undefined,
                }));
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? "admin-name-error" : undefined
              }
              maxLength={100}
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
              autoComplete="name"
            />
          </div>
          <FormFieldError id="admin-name-error" message={fieldErrors.name} />
        </div>

        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? "admin-email-error" : undefined
              }
              maxLength={254}
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
              autoComplete="email"
            />
          </div>
          <FormFieldError id="admin-email-error" message={fieldErrors.email} />
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Role: <span className="font-semibold capitalize">{profile.role}</span>
          <span className="mx-2">·</span>
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
