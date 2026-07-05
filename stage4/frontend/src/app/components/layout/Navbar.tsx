import { Anchor, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roleLabel } from "../../lib/roles";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Centers", to: "/centers" },
  { label: "Trips", to: "/trips" },
  { label: "Courses", to: "/courses" },
  { label: "About Us", to: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button type="button" onClick={() => goTo("/")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
            <Anchor className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold uppercase tracking-widest text-slate-900">Oyster</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-teal-600" : "text-slate-500 hover:text-slate-900"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {(!isAuthenticated || user?.role === "diving_center") && (
            <button type="button" onClick={() => goTo("/center/dashboard")} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
              Center Portal
            </button>
          )}
          {(!isAuthenticated || user?.role === "admin") && (
            <button type="button" onClick={() => goTo("/admin")} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
              Admin
            </button>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
              aria-expanded={userMenuOpen}
            >
              {isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"} <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400">{roleLabel(user.role)}</p>
                    </div>
                    <button type="button" onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-slate-50">Log out</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => goTo("/auth")} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">Sign In</button>
                    <button type="button" onClick={() => goTo("/auth?tab=register")} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50">Register</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="text-slate-600 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="space-y-3 border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block py-1 text-sm font-medium ${isActive ? "text-teal-600" : "text-slate-600"}`}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex gap-3 border-t border-slate-100 pt-2">
            {isAuthenticated && user ? (
              <>
                <button type="button" onClick={() => goTo("/")} className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600">{roleLabel(user.role)}</button>
                <button type="button" onClick={handleLogout} className="flex-1 rounded-xl bg-red-50 py-2 text-sm font-semibold text-red-600">Log out</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => goTo("/auth")} className="flex-1 rounded-xl border border-teal-200 py-2 text-sm font-semibold text-teal-600">Sign In</button>
                <button type="button" onClick={() => goTo("/center/dashboard")} className="flex-1 rounded-xl bg-teal-500 py-2 text-sm font-semibold text-white">Center Portal</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
