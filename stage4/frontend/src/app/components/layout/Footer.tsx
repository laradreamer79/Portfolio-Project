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
    <footer className="mt-auto bg-slate-900 py-12 text-white">
      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500">
              <Anchor className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-widest">Oyster</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">Saudi Arabia's premier diving platform. Connect with certified centers across the Kingdom.</p>
        </div>

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
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-slate-800 px-6 pt-6">
        <p className="text-xs text-slate-500">© 2026 Oyster. All rights reserved.</p>
        <p className="text-xs text-slate-500">Dive Saudi Arabia.</p>
      </div>
    </footer>
  );
}
