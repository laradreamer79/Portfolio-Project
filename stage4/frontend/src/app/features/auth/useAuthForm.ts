import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegistrationRole } from "../../lib/roles";
import { isValidEmail } from "../../lib/validation";
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

    if (!isValidEmail(loginForm.email)) {
      setValidationError("Enter a valid email address.");
      return;
    }

    if (!loginForm.password) {
      setValidationError("Password is required.");
      return;
    }

    try {
      await login({ ...loginForm, email: loginForm.email.trim() });
      finishAuthentication();
    } catch {
      // AuthProvider exposes the request error.
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    const name = registerForm.name.trim();
    const email = registerForm.email.trim();

    if (name.length < 2) {
      setValidationError("Name must be at least 2 characters.");
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError("Enter a valid email address.");
      return;
    }

    if (registerForm.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (
      registerForm.role === "instructor" &&
      registerForm.instructorLicenseNumber.trim().length < 2
    ) {
      setValidationError("Instructor license number is required.");
      return;
    }

    if (
      registerForm.role === "diving_center" &&
      (registerForm.centerName.trim().length < 2 ||
        registerForm.centerCity.trim().length < 2 ||
        registerForm.centerLicenseNumber.trim().length < 2)
    ) {
      setValidationError(
        "Center name, city, and license number are required.",
      );
      return;
    }

    try {
      await register({
        ...registerForm,
        name,
        email,
        instructorLicenseNumber:
          registerForm.instructorLicenseNumber.trim(),
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
