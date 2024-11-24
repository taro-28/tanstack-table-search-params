import type { State } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

export const encodeColumnFilters = (
  stateValue: State["columnFilters"],
  defaultValue: State["columnFilters"],
): Query[string] => {
  if (JSON.stringify(stateValue) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (stateValue.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return stateValue
    .map(
      ({ id, value }) =>
        `${id}.${encodeURIComponent(JSON.stringify(value)).replaceAll(".", "%2E")}`,
    )
    .join(",");
};

export const decodeColumnFilters = (
  queryValue: Query[string],
  defaultValue: State["columnFilters"],
): State["columnFilters"] => {
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === noneStringForCustomDefaultValue) {
    return [];
  }

  try {
    return queryValue
      .split(",")
      .map((item) => {
        const [id, stringValue] = item.split(".");
        if (!id) throw new Error("Invalid columnFilters");
        if (stringValue === undefined) throw new Error("Invalid columnFilters");

        return {
          id,
          value:
            stringValue === "undefined"
              ? undefined
              : JSON.parse(decodeURIComponent(stringValue)),
        };
      })
      .filter((x) => x !== null);
  } catch {
    return defaultValue;
  }
};
