import type { State } from "..";
import type { Query } from "../types";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";

export const encodeSorting = (
  stateValue: State["sorting"],
  defaultValue: State["sorting"],
): Query[string] =>
  JSON.stringify(stateValue) === JSON.stringify(defaultValue)
    ? undefined
    : stateValue.length > 0
      ? stateValue
          .map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
          .join(",")
      : encodedEmptyStringForCustomDefaultValue;

export const decodeSorting = (
  queryValue: Query[string],
  defaultValue: State["sorting"],
) => {
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === encodedEmptyStringForCustomDefaultValue) {
    return defaultValue.length > 0 ? [] : defaultValue;
  }

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
    return defaultValue;
  }
};
