const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
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

function errorDetails(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return undefined;
  return (payload as { details?: unknown }).details;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
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
    const payload = isJson ? await parseJson(response) : null;

    if (!response.ok) {
      throw new ApiError(
        errorMessage(payload),
        response.status,
        errorDetails(payload),
      );
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
