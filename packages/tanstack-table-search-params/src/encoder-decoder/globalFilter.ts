import type { State } from "..";
import type { Query } from "../types";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";

export const encodeGlobalFilter = (
  stateValue: State["globalFilter"],
  defaultValue: State["globalFilter"],
): Query[string] => {
  if (stateValue === defaultValue) {
    return undefined;
  }
  if (typeof stateValue !== "string") {
    return defaultValue;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (stateValue === "") {
    return encodedEmptyStringForCustomDefaultValue;
  }
  return stateValue;
};

export const decodeGlobalFilter = (
  queryValue: Query[string],
  defaultValue: State["globalFilter"],
) => {
  if (typeof queryValue !== "string") {
    return defaultValue;
  }
  if (queryValue === encodedEmptyStringForCustomDefaultValue) {
    return defaultValue === "" ? encodedEmptyStringForCustomDefaultValue : "";
  }
  return queryValue;
};
