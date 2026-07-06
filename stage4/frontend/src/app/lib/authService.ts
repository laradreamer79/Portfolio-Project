import { apiRequest } from "./apiClient";
import type { RegistrationRole, UserRole } from "./roles";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  message?: string;
  token: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: RegistrationRole;
};

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function getMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", { token });
}
