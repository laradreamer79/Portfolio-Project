const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown | FormData;
  token?: string | null;
};

function errorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Something went wrong. Please try again.";
  }

  const data = payload as {
    message?: string;
    errors?: Array<{ message?: string }>;
  };

  return data.errors?.[0]?.message ?? data.message ??
    "Something went wrong. Please try again.";
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;
  const isFormData = body instanceof FormData;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
    });

    const isJson = response.headers.get("content-type")?.includes(
      "application/json",
    );
    const payload: unknown = isJson
      ? await response.json().catch(() => null)
      : null;

    if (!response.ok) {
      throw new ApiError(errorMessage(payload), response.status);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Unable to reach the server. Check that the backend is running.",
      0,
    );
  }
}
