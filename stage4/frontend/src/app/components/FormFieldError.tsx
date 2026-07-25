export function FormFieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      id={id}
      aria-live="polite"
      className="mt-1.5 text-xs text-red-600"
    >
      {message}
    </p>
  );
}
