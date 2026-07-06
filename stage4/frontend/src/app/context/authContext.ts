import { createContext } from "react";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../lib/authService";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
