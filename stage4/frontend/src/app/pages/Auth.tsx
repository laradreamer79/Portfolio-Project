import { useEffect, useState, type FormEvent } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Anchor, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathForRole } from "../lib/roles";

type AuthTab = "login" | "register";

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    user,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    error,
    login,
    register,
    clearError,
  } = useAuth();

  const [tab, setTab] = useState<AuthTab>(
    params.get("tab") === "register" ? "register" : "login",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const requestedPath = (
    location.state as { from?: string } | null
  )?.from;

  const switchTab = (nextTab: AuthTab) => {
    clearError();
    setTab(nextTab);
  };

  const finishAuthentication = (role: NonNullable<typeof user>["role"]) => {
    navigate(
      requestedPath && requestedPath !== "/auth"
        ? requestedPath
        : dashboardPathForRole(role),
      { replace: true },
    );
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const authenticatedUser = await login(loginForm);
      finishAuthentication(authenticatedUser.role);
    } catch {
      // AuthProvider exposes the request error to the page.
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const authenticatedUser = await register(registerForm);
      finishAuthentication(authenticatedUser.role);
    } catch {
      // AuthProvider exposes the request error to the page.
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mx-auto mb-8 flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500">
            <Anchor className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-2xl font-bold uppercase tracking-widest text-slate-900">
            Oyster
          </span>
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex border-b border-slate-100">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 py-4 text-sm font-semibold ${
                tab === "login"
                  ? "-mb-px border-b-2 border-teal-500 text-teal-600"
                  : "text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 py-4 text-sm font-semibold ${
                tab === "register"
                  ? "-mb-px border-b-2 border-teal-500 text-teal-600"
                  : "text-slate-400"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {tab === "login" ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <Field
                  label="Email"
                  type="email"
                  value={loginForm.email}
                  onChange={(value) =>
                    setLoginForm((form) => ({ ...form, email: value }))
                  }
                  autoComplete="email"
                />
                <PasswordField
                  value={loginForm.password}
                  onChange={(value) =>
                    setLoginForm((form) => ({ ...form, password: value }))
                  }
                  show={showPassword}
                  onToggle={() => setShowPassword((visible) => !visible)}
                  autoComplete="current-password"
                />
                <SubmitButton loading={isSubmitting}>Sign In</SubmitButton>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <Field
                  label="Full Name"
                  value={registerForm.name}
                  onChange={(value) =>
                    setRegisterForm((form) => ({ ...form, name: value }))
                  }
                  autoComplete="name"
                  minLength={2}
                />
                <Field
                  label="Email"
                  type="email"
                  value={registerForm.email}
                  onChange={(value) =>
                    setRegisterForm((form) => ({ ...form, email: value }))
                  }
                  autoComplete="email"
                />
                <PasswordField
                  value={registerForm.password}
                  onChange={(value) =>
                    setRegisterForm((form) => ({ ...form, password: value }))
                  }
                  show={showPassword}
                  onToggle={() => setShowPassword((visible) => !visible)}
                  autoComplete="new-password"
                  minLength={6}
                />
                <p className="text-xs text-slate-400">
                  New accounts start as diver accounts. Staff roles are assigned
                  separately.
                </p>
                <SubmitButton loading={isSubmitting}>
                  Create Account
                </SubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  minLength?: number;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  minLength,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        minLength={minLength}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-teal-400"
      />
    </label>
  );
}

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  minLength?: number;
};

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  minLength,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">
        Password
      </span>
      <span className="relative block">
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 outline-none transition-colors focus:border-teal-400"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </span>
    </label>
  );
}

function SubmitButton({
  children,
  loading,
}: {
  children: string;
  loading: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
