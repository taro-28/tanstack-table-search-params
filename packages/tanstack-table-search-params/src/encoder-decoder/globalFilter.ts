import type { State } from "..";
import type { Query } from "../types";

export const encodeGlobalFilter = (
  globalFilter: State["globalFilter"],
): Query[string] =>
  typeof globalFilter === "string" && globalFilter !== ""
    ? globalFilter
    : undefined;

export const decodeGlobalFilter = (queryValue: Query[string]) =>
  typeof queryValue === "string" ? queryValue : "";
