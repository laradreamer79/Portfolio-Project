import { ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { FormFieldError } from "../../components/FormFieldError";
import { digitsOnly } from "../../lib/validation";

type AuthFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  numericOnly?: boolean;
};

export function AuthField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  minLength,
  maxLength,
  inputMode,
  numericOnly = false,
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-600"
      >
        {label}
      </label>
      <input
        id={id}
        required
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            numericOnly
              ? digitsOnly(event.target.value, maxLength)
              : event.target.value,
          )
        }
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-teal-400"
      />
      <FormFieldError id={`${id}-error`} message={error} />
    </div>
  );
}

type AuthSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
};

export function AuthSelectField({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
}: AuthSelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-600"
      >
        {label}
      </label>
      <span className="relative block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition-colors focus:border-teal-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        />
      </span>
      <FormFieldError id={`${id}-error`} message={error} />
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  minLength?: number;
  maxLength?: number;
  error?: string;
};

export function PasswordField({
  id,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  minLength,
  maxLength,
  error,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-600"
      >
        Password
      </label>
      <span className="relative block">
        <input
          id={id}
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 outline-none transition-colors focus:border-teal-400"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </span>
      <FormFieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function AuthSubmitButton({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
