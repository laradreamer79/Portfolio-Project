import { Navigate } from "react-router-dom";
import { Anchor, Loader2 } from "lucide-react";
import {
  AuthField,
  AuthSelectField,
  AuthSubmitButton,
  AUTH_FIELD_LIMITS,
  PasswordField,
  useAuthForm,
} from "../features/auth";
import { DIVING_CITIES } from "../data";

export function Auth() {
  const {
    error,
    goHome,
    handleLogin,
    handleRegister,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    loginErrors,
    loginForm,
    registerErrors,
    registerForm,
    setRegistrationRole,
    showPassword,
    switchTab,
    tab,
    togglePassword,
    updateLoginField,
    updateRegisterField,
    user,
  } = useAuthForm();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={goHome}
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
              <form
                className="space-y-4"
                onSubmit={handleLogin}
                noValidate
              >
                <AuthField
                  id="login-email"
                  label="Email"
                  type="email"
                  value={loginForm.email}
                  onChange={(value) => updateLoginField("email", value)}
                  autoComplete="email"
                  error={loginErrors.email}
                />
                <PasswordField
                  id="login-password"
                  value={loginForm.password}
                  onChange={(value) => updateLoginField("password", value)}
                  show={showPassword}
                  onToggle={togglePassword}
                  autoComplete="current-password"
                  error={loginErrors.password}
                />
                <AuthSubmitButton loading={isSubmitting}>
                  Sign In
                </AuthSubmitButton>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={handleRegister}
                noValidate
              >
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-600">
                    Account Type
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["user", "Diver"],
                      ["instructor", "Instructor"],
                      ["diving_center", "Diving Center"],
                    ] as const).map(([role, label]) => (
                      <button
                        key={role}
                        type="button"
                        aria-pressed={registerForm.role === role}
                        onClick={() => setRegistrationRole(role)}
                        className={`rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${
                          registerForm.role === role
                            ? "border-teal-400 bg-teal-50 text-teal-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <AuthField
                  id="register-name"
                  label="Full Name"
                  value={registerForm.name}
                  onChange={(value) => updateRegisterField("name", value)}
                  autoComplete="name"
                  minLength={2}
                  maxLength={AUTH_FIELD_LIMITS.name}
                  error={registerErrors.name}
                />
                <AuthField
                  id="register-email"
                  label="Email"
                  type="email"
                  value={registerForm.email}
                  onChange={(value) => updateRegisterField("email", value)}
                  autoComplete="email"
                  maxLength={AUTH_FIELD_LIMITS.email}
                  error={registerErrors.email}
                />
                <AuthField
                  id="register-phone"
                  label="Phone Number"
                  type="tel"
                  value={registerForm.phone}
                  onChange={(value) => updateRegisterField("phone", value)}
                  autoComplete="tel"
                  inputMode="numeric"
                  numericOnly
                  minLength={AUTH_FIELD_LIMITS.phone}
                  maxLength={AUTH_FIELD_LIMITS.phone}
                  error={registerErrors.phone}
                />
                <PasswordField
                  id="register-password"
                  value={registerForm.password}
                  onChange={(value) => updateRegisterField("password", value)}
                  show={showPassword}
                  onToggle={togglePassword}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={AUTH_FIELD_LIMITS.password}
                  error={registerErrors.password}
                />
                {registerForm.role === "instructor" && (
                  <>
                    <AuthField
                      id="instructor-license"
                      label="Instructor License Number"
                      value={registerForm.instructorLicenseNumber}
                      onChange={(value) =>
                        updateRegisterField("instructorLicenseNumber", value)
                      }
                      autoComplete="off"
                      inputMode="numeric"
                      numericOnly
                      minLength={2}
                      maxLength={AUTH_FIELD_LIMITS.license}
                      error={registerErrors.instructorLicenseNumber}
                    />
                    <AuthSelectField
                      id="instructor-city"
                      label="City"
                      value={registerForm.instructorCity}
                      options={DIVING_CITIES}
                      placeholder="Choose a city"
                      onChange={(value) =>
                        updateRegisterField("instructorCity", value)
                      }
                      error={registerErrors.instructorCity}
                    />
                  </>
                )}
                {registerForm.role === "diving_center" && (
                  <div className="space-y-4">
                    <AuthField
                      id="center-name"
                      label="Diving Center Name"
                      value={registerForm.centerName}
                      onChange={(value) =>
                        updateRegisterField("centerName", value)
                      }
                      autoComplete="organization"
                      minLength={2}
                      maxLength={AUTH_FIELD_LIMITS.centerName}
                      error={registerErrors.centerName}
                    />
                    <AuthSelectField
                      id="center-city"
                      label="City"
                      value={registerForm.centerCity}
                      options={DIVING_CITIES}
                      placeholder="Choose a city"
                      onChange={(value) =>
                        updateRegisterField("centerCity", value)
                      }
                      error={registerErrors.centerCity}
                    />
                    <AuthField
                      id="center-license"
                      label="Diving Center License Number"
                      value={registerForm.centerLicenseNumber}
                      onChange={(value) =>
                        updateRegisterField("centerLicenseNumber", value)
                      }
                      autoComplete="off"
                      inputMode="numeric"
                      numericOnly
                      minLength={2}
                      maxLength={AUTH_FIELD_LIMITS.license}
                      error={registerErrors.centerLicenseNumber}
                    />
                  </div>
                )}
                <AuthSubmitButton loading={isSubmitting}>
                  Create Account
                </AuthSubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
