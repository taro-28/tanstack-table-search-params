import type { State } from "..";
import type { Query } from "../types";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";

export const encodeSorting = (
  stateValue: State["sorting"],
  defaultValue: State["sorting"],
): Query[string] => {
  if (JSON.stringify(stateValue) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (stateValue.length === 0) {
    return encodedEmptyStringForCustomDefaultValue;
  }

  return stateValue
    .map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
    .join(",");
};

export const decodeSorting = (
  queryValue: Query[string],
  defaultValue: State["sorting"],
) => {
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === encodedEmptyStringForCustomDefaultValue) {
    return [];
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
