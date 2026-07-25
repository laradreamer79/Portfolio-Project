import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Root() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      <ScrollToTop />
      <Navbar />

      {/* Page content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
