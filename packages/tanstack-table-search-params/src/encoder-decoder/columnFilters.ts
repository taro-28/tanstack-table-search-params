import type { State } from "..";
import type { Query } from "../types";

export const encodeColumnFilters = (
  columnFilters: State["columnFilters"],
): Query[string] =>
  columnFilters.length === 0
    ? undefined
    : columnFilters
        .map(
          ({ id, value }) =>
            `${id}.${encodeURIComponent(JSON.stringify(value))}`,
        )
        .join(",");

export const decodeColumnFilters = (
  queryValue: Query[string],
): State["columnFilters"] => {
  if (typeof queryValue !== "string" || queryValue === "") return [];

  try {
    return queryValue
      .split(",")
      .map((item) => {
        const [id, stringValue] = item.split(".");
        if (!id) throw new Error("Invalid columnFilters");
        if (stringValue === undefined) throw new Error("Invalid columnFilters");

        try {
          return {
            id,
            value:
              stringValue === "undefined"
                ? undefined
                : JSON.parse(decodeURIComponent(stringValue)),
          };
        } catch {
          return null;
        }
      })
      .filter((x) => x !== null);
  } catch {
    return [];
  }
};
