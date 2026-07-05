import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError } from "../lib/apiClient";
import * as authService from "../lib/authService";
import type { AuthUser, LoginPayload, RegisterPayload } from "../lib/authService";

const STORAGE_KEY = "oyster_auth";

type StoredAuth = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.token && parsed?.user) return parsed as StoredAuth;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore the authenticated user after a page refresh.
  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setToken(stored.token);
      setUser(stored.user);
    }
    setIsInitializing(false);
  }, []);

  const persist = (next: StoredAuth | null) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (payload: LoginPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      setToken(response.token);
      setUser(response.user);
      persist({ token: response.token, user: response.user });
      return response.user;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to sign in. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      setToken(response.token);
      setUser(response.user);
      persist({ token: response.token, user: response.user });
      return response.user;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to create your account. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    persist(null);
  };

  const clearError = () => setError(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isInitializing,
      isSubmitting,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, token, isInitializing, isSubmitting, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
