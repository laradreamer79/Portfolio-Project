import { Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 text-center">
      <div>
        <Anchor className="mx-auto mb-5 h-12 w-12 text-teal-500" />
        <p className="font-display text-7xl font-bold text-slate-200">404</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-wide text-slate-900">PAGE NOT FOUND</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          The page you are looking for does not exist or may have moved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
