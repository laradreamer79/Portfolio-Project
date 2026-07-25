import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../lib/apiClient";
import {
  hasFieldErrors,
  type FieldErrors,
} from "../../lib/validation";
import type { RegistrationRole } from "../../lib/roles";
import {
  registrationConflictErrors,
  type LoginPayload,
} from "./authService";
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
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER_FORM);
  const [loginErrors, setLoginErrors] = useState<
    FieldErrors<keyof LoginPayload>
  >({});
  const [registerErrors, setRegisterErrors] = useState<
    FieldErrors<keyof RegisterFormState>
  >({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const requestedPath = (location.state as { from?: string } | null)?.from;

  function switchTab(nextTab: AuthTab) {
    clearError();
    setLoginErrors({});
    setRegisterErrors({});
    setTab(nextTab);
  }

  function updateLoginField(field: keyof LoginPayload, value: string) {
    clearError();
    setLoginErrors((current) => ({ ...current, [field]: undefined }));
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegisterField(field: RegisterTextField, value: string) {
    clearError();
    setRegisterErrors((current) => ({ ...current, [field]: undefined }));
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  function setRegistrationRole(role: RegistrationRole) {
    clearError();
    setRegisterErrors({});
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

    const errors = validateLoginForm(loginForm);
    setLoginErrors(errors);
    if (hasFieldErrors(errors)) return;

    try {
      await login({ ...loginForm, email: loginForm.email.trim() });
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    const errors = validateRegisterForm(registerForm);
    setRegisterErrors(errors);
    if (hasFieldErrors(errors)) return;

    const name = registerForm.name.trim();
    const email = registerForm.email.trim();
    const instructorLicenseNumber =
      registerForm.instructorLicenseNumber.trim();
    const centerLicenseNumber =
      registerForm.centerLicenseNumber.trim();

    try {
      await register({
        ...registerForm,
        name,
        email,
        instructorLicenseNumber,
        instructorCity: registerForm.instructorCity.trim(),
        centerName: registerForm.centerName.trim(),
        centerCity: registerForm.centerCity.trim(),
        centerLicenseNumber,
      });
      finishAuthentication();
    } catch (requestError) {
      const conflictErrors = registrationConflictErrors(
        requestError,
        registerForm.role,
      );

      if (
        requestError instanceof ApiError &&
        hasFieldErrors(conflictErrors)
      ) {
        clearError();
        setRegisterErrors((current) => ({
          ...current,
          ...conflictErrors,
        }));
      }
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
    loginErrors,
    registerForm,
    registerErrors,
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
