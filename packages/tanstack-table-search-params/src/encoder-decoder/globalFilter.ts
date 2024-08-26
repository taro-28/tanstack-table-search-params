import type { State } from "..";
import type { Query } from "../types";

export const encodedEmptyStringGlobalFilterForCustomDefaultValue =
  encodeURIComponent(JSON.stringify(""));

export const encodeGlobalFilter = (
  stateValue: State["globalFilter"],
  defaultValue: State["globalFilter"],
): Query[string] => {
  if (typeof stateValue !== "string") {
    return undefined;
  }
  if (stateValue === defaultValue) {
    return undefined;
  }
  if (stateValue === "") {
    return encodedEmptyStringGlobalFilterForCustomDefaultValue;
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
  if (queryValue === encodedEmptyStringGlobalFilterForCustomDefaultValue) {
    return defaultValue === ""
      ? encodedEmptyStringGlobalFilterForCustomDefaultValue
      : "";
  }
  return queryValue;
};
