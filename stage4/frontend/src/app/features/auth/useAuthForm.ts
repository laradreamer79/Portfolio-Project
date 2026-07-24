import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegistrationRole } from "../../lib/roles";
import type { LoginPayload } from "./authService";
import {
  validateLoginForm,
  validateRegisterForm,
  type RegisterFormState,
} from "./authValidation";

export type AuthTab = "login" | "register";

type RegisterTextField = Exclude<keyof RegisterFormState, "role">;

const EMPTY_LOGIN_FORM: LoginPayload = { email: "", password: "" };

const EMPTY_REGISTER_FORM: RegisterFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
  instructorLicenseNumber: "",
  instructorCity: "",
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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER_FORM);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const requestedPath = (location.state as { from?: string } | null)?.from;

  function switchTab(nextTab: AuthTab) {
    clearError();
    setValidationError(null);
    setTab(nextTab);
  }

  function updateLoginField(field: keyof LoginPayload, value: string) {
    setValidationError(null);
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegisterField(field: RegisterTextField, value: string) {
    setValidationError(null);
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  function setRegistrationRole(role: RegistrationRole) {
    setValidationError(null);
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

    const error = validateLoginForm(loginForm);
    if (error) return setValidationError(error);

    try {
      await login({ ...loginForm, email: loginForm.email.trim() });
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    const error = validateRegisterForm(registerForm);
    if (error) return setValidationError(error);

    const name = registerForm.name.trim();
    const email = registerForm.email.trim();

    try {
      await register({
        ...registerForm,
        name,
        email,
        instructorLicenseNumber:
          registerForm.instructorLicenseNumber.trim(),
        instructorCity: registerForm.instructorCity.trim(),
        centerName: registerForm.centerName.trim(),
        centerCity: registerForm.centerCity.trim(),
        centerLicenseNumber: registerForm.centerLicenseNumber.trim(),
      });
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  return {
    error: validationError ?? error,
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
