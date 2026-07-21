import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegistrationRole } from "../../lib/roles";
import type { LoginPayload } from "./authService";

export type AuthTab = "login" | "register";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: RegistrationRole;
  instructorLicenseNumber: string;
  centerName: string;
  centerCity: string;
  centerLicenseNumber: string;
};

type RegisterTextField = Exclude<keyof RegisterFormState, "role">;

const EMPTY_LOGIN_FORM: LoginPayload = { email: "", password: "" };

const EMPTY_REGISTER_FORM: RegisterFormState = {
  name: "",
  email: "",
  password: "",
  role: "user",
  instructorLicenseNumber: "",
  centerName: "",
  centerCity: "",
  centerLicenseNumber: "",
};

export function useAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    clearError,
    error,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    login,
    register,
    user,
  } = useAuth();
  const [tab, setTab] = useState<AuthTab>(
    params.get("tab") === "register" ? "register" : "login",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER_FORM);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const requestedPath = (location.state as { from?: string } | null)?.from;

  function switchTab(nextTab: AuthTab) {
    clearError();
    setTab(nextTab);
  }

  function updateLoginField(field: keyof LoginPayload, value: string) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegisterField(field: RegisterTextField, value: string) {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  function setRegistrationRole(role: RegistrationRole) {
    setRegisterForm((current) => ({ ...current, role }));
  }

  function finishAuthentication() {
    navigate(
      requestedPath && requestedPath !== "/auth" ? requestedPath : "/",
      { replace: true },
    );
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      await login(loginForm);
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      await register(registerForm);
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  return {
    error,
    goHome: () => navigate("/"),
    handleLogin,
    handleRegister,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    loginForm,
    registerForm,
    setRegistrationRole,
    showPassword,
    switchTab,
    tab,
    togglePassword: () => setShowPassword((visible) => !visible),
    updateLoginField,
    updateRegisterField,
    user,
  };
}
