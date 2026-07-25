import { Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Browse Centers", to: "/centers" },
      { label: "Dive Trips", to: "/trips" },
      { label: "Courses", to: "/courses" },
    ],
  },
  {
    title: "Operators",
    links: [
      { label: "Center Portal", to: "/center/dashboard" },
      { label: "Post a Trip", to: "/center/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About", to: "/about" }],
  },
];

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-auto bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12">
        <div className="max-w-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500">
              <Anchor className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-widest">Oyster</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Saudi Arabia&apos;s premier diving platform. Connect with certified
            centers across the Kingdom.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button type="button" onClick={() => navigate(link.to)} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-slate-800 px-6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">© 2026 Oyster. All rights reserved.</p>
        <p className="text-xs text-slate-500">Dive Saudi Arabia.</p>
      </div>
    </footer>
  );
}
