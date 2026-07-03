import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Anchor, Eye, EyeOff, CheckCircle } from "lucide-react";

export function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">(params.get("tab") === "register" ? "register" : "login");
  const [role, setRole] = useState<"user" | "center_owner" | "instructor">("user");
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "", centerName: "", city: "", certifications: "" });

  const setL = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setLoginForm((f) => ({ ...f, [k]: e.target.value }));
  const setR = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setRegForm((f) => ({ ...f, [k]: e.target.value }));

  if (done) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center max-w-md w-full space-y-5 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-teal-500" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-wide">
            {tab === "login" ? "WELCOME BACK!" : "ACCOUNT CREATED!"}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {tab === "login" ? "You are now signed in." : "Your account is ready. Welcome to Oyster!"}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/")} className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl hover:border-slate-300 transition-colors text-sm">Go Home</button>
          <button onClick={() => navigate(role === "center_owner" ? "/center/dashboard" : "/dashboard")} className="flex-1 bg-teal-500 text-white font-semibold py-2.5 rounded-xl hover:bg-teal-600 transition-colors text-sm">
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-widest text-slate-900 uppercase">Oyster</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {(["login", "register"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${tab === t ? "text-teal-600 border-b-2 border-teal-500 -mb-px" : "text-slate-400 hover:text-slate-600"}`}>
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {/* Role selector (register only) */}
            {tab === "register" && (
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["user", "center_owner", "instructor"] as const).map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all ${role === r ? "bg-teal-50 border-teal-300 text-teal-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {r === "user" ? "🤿  Diver" : r === "center_owner" ? "🏪  Dive Center" : "👩‍🏫  Instructor"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login form */}
            {tab === "login" && (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Email</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="your@email.com" value={loginForm.email} onChange={setL("email")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors pr-10" placeholder="••••••••" value={loginForm.password} onChange={setL("password")} />
                    <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button className="text-xs text-teal-600 hover:text-teal-800 mt-1.5 block">Forgot password?</button>
                </div>
                <button onClick={() => loginForm.email && loginForm.password && setDone(true)} disabled={!loginForm.email || !loginForm.password} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Sign In
                </button>
              </>
            )}

            {/* Register form */}
            {tab === "register" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Full Name *</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="Mohammed Al-Rashid" value={regForm.name} onChange={setR("name")} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Email Address *</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="your@email.com" value={regForm.email} onChange={setR("email")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Phone</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="+966 50 000 0000" value={regForm.phone} onChange={setR("phone")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Password *</label>
                    <input type="password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="••••••••" value={regForm.password} onChange={setR("password")} />
                  </div>
                  {role === "center_owner" && (
                    <>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-slate-600 block mb-1.5">Dive Center Name *</label>
                        <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="e.g. Red Sea Divers Jeddah" value={regForm.centerName} onChange={setR("centerName")} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-slate-600 block mb-1.5">City</label>
                        <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400 transition-colors bg-white" value={regForm.city} onChange={setR("city")}>
                          <option value="">Select city...</option>
                          {["Jeddah", "Yanbu", "Dammam", "Al Khobar", "NEOM", "Jizan"].map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                  {role === "instructor" && (
                    <>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-slate-600 block mb-1.5">Certifications</label>
                        <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors" placeholder="e.g. PADI, NAUI" value={regForm.certifications} onChange={setR("certifications")} />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400">By registering you agree to our Terms of Service and Privacy Policy.</p>
                <button onClick={() => regForm.name && regForm.email && regForm.password && setDone(true)} disabled={!regForm.name || !regForm.email || !regForm.password} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Create Account
                </button>
              </>
            )}

            <div className="text-center text-xs text-slate-400 pt-1">
              {tab === "login" ? (
                <>Don't have an account? <button onClick={() => setTab("register")} className="text-teal-600 font-medium hover:text-teal-800">Register</button></>
              ) : (
                <>Already have an account? <button onClick={() => setTab("login")} className="text-teal-600 font-medium hover:text-teal-800">Sign in</button></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
