const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

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
  body?: unknown;
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
};

function extractErrorMessage(payload: any): string {
  const issues = payload?.errors;
  if (Array.isArray(issues) && issues.length > 0 && typeof issues[0]?.message === "string") {
    return issues[0].message;
  }
  return payload?.message ?? "Something went wrong. Please try again.";
}

function buildQueryString(params?: RequestOptions["params"]): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => search.set(key, String(value)));
  return `?${search.toString()}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, params } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}${buildQueryString(params)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please check your connection and try again.", 0);
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload), response.status, payload?.errors);
  }

  return (payload ?? undefined) as T;
}
