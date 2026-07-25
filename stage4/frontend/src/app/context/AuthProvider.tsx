import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../lib/apiClient";
import * as authService from "../features/auth/authService";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../features/auth/authService";
import { AuthContext, type AuthContextValue } from "./authContext";

const STORAGE_KEY = "oyster_auth";

type StoredAuth = {
  token: string;
  user: AuthUser;
};

function readStoredAuth(): StoredAuth | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<StoredAuth>;
    return parsed.token && parsed.user
      ? { token: parsed.token, user: parsed.user }
      : null;
  } catch {
    return null;
  }
}

function saveStoredAuth(value: StoredAuth | null) {
  if (value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    saveStoredAuth(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const stored = readStoredAuth();

    if (!stored) {
      setIsInitializing(false);
      return;
    }

    authService
      .getMe(stored.token)
      .then((currentUser) => {
        setToken(stored.token);
        setUser(currentUser);
        saveStoredAuth({ token: stored.token, user: currentUser });
      })
      .catch(() => saveStoredAuth(null))
      .finally(() => setIsInitializing(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.login(payload);
      setToken(response.token);
      setUser(response.user);
      saveStoredAuth(response);
      return response.user;
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to sign in."));
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.register(payload);
      setToken(response.token);
      setUser(response.user);
      saveStoredAuth(response);
      return response.user;
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create your account."));
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

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
    [
      error,
      clearError,
      isInitializing,
      isSubmitting,
      login,
      logout,
      register,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
