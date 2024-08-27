import type { State } from "..";
import type { Query } from "../types";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";

export const encodeColumnFilters = (
  stateValue: State["columnFilters"],
  defaultValue: State["columnFilters"],
): Query[string] =>
  JSON.stringify(stateValue) === JSON.stringify(defaultValue)
    ? undefined
    : stateValue.length > 0
      ? stateValue
          .map(
            ({ id, value }) =>
              `${id}.${encodeURIComponent(JSON.stringify(value))}`,
          )
          .join(",")
      : encodedEmptyStringForCustomDefaultValue;

export const decodeColumnFilters = (
  queryValue: Query[string],
  defaultValue: State["columnFilters"],
): State["columnFilters"] => {
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === encodedEmptyStringForCustomDefaultValue) {
    return defaultValue.length > 0 ? [] : defaultValue;
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
