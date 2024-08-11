import type { Query } from "./types";

export function convertQueryToURLSearchParams(query: Query): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const element of value) {
        searchParams.append(key, element);
      }
    } else {
      searchParams.append(key, value);
    }
  }
  return searchParams;
}
