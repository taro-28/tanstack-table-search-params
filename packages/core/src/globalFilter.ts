import type { State } from ".";
import type { Query } from "./types";

export const encodeGlobalFilter = (
  globalFilter: State["globalFilter"],
): string | undefined => {
  return typeof globalFilter === "string" && globalFilter !== ""
    ? globalFilter
    : undefined;
};

export const decodeGlobalFilter = (queryValue: Query[string]): string => {
  return typeof queryValue === "string" ? queryValue : "";
};
