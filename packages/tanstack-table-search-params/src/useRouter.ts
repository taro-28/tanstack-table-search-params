import { useMemo, useSyncExternalStore } from "react";

const events = ["popstate", "pushstate", "replacestate"];

export const useRouter = () => {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const query = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return Object.fromEntries(searchParams.entries());
  }, [search]);

  const router = useMemo(
    () => ({
      pathname: typeof window === "undefined" ? "" : window.location.pathname,
      query,
    }),
    [query],
  );

  return useSyncExternalStore(
    (callback) => {
      for (const event of events) {
        window.addEventListener(event, callback);
      }
      return () => {
        for (const event of events) {
          window.removeEventListener(event, callback);
        }
      };
    },
    () => router,
    () => ({ pathname: "", query: {} }),
  );
};