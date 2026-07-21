import { useSearchParams } from "react-router-dom";

export function useUrlTab<T extends string>(tabs: readonly T[], fallback: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab") as T | null;
  const activeTab = requested && tabs.includes(requested) ? requested : fallback;

  const setActiveTab = (tab: T) => {
    const next = new URLSearchParams(searchParams);
    if (tab === fallback) next.delete("tab");
    else next.set("tab", tab);
    setSearchParams(next, { replace: true });
  };

  return [activeTab, setActiveTab] as const;
}
