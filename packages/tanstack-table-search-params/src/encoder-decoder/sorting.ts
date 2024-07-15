import type { State } from "..";
import type { Query } from "../types";

export const encodeSorting = (
  sorting: State["sorting"],
): string | undefined => {
  if (sorting.length === 0) return undefined;
  return sorting
    .map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
    .join(",");
};

export const decodeSorting = (queryValue: Query[string]): State["sorting"] => {
  if (typeof queryValue !== "string" || queryValue === "") return [];

  try {
    return queryValue.split(",").map((sort) => {
      const [id, order] = sort.split(".");
      if (!id) throw new Error("Invalid sorting");
      if (order !== "asc" && order !== "desc") {
        throw new Error("Invalid sorting");
      }
      return { id, desc: order === "desc" };
    });
  } catch {
    return [];
  }
};
