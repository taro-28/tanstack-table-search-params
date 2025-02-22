import type { State } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

export const encodeColumnOrder = (
  stateValue: State["columnOrder"],
  defaultValue: State["columnOrder"],
): Query[string] => {
  if (JSON.stringify(stateValue) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (stateValue.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return stateValue
    .map((v) => v.replaceAll(",", encodeURIComponent(",")))
    .join(",");
};

export const decodeColumnOrder = (
  queryValue: Query[string],
  defaultValue: State["columnOrder"],
): State["columnOrder"] => {
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === noneStringForCustomDefaultValue) {
    return [];
  }

  return queryValue
    .split(",")
    .map((v) => v.replaceAll(encodeURIComponent(","), ","));
};
