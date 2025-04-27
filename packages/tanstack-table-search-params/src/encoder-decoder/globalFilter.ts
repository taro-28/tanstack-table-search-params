import type { State as TanstackTableState } from "..";
import type { Query } from "../types";

export const encodedEmptyStringForGlobalFilterCustomDefaultValue =
  encodeURIComponent(JSON.stringify(""));

/**
 * The default encoder of Tanstack Table's `globalFilter`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeGlobalFilter = (
  value: TanstackTableState["globalFilter"] | undefined,
  options?: {
    defaultValue?: TanstackTableState["globalFilter"];
  },
): Query[string] => {
  const defaultValue = options?.defaultValue;
  if (value === defaultValue) {
    return undefined;
  }
  if (typeof value !== "string") {
    return defaultValue;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (value === "") {
    return encodedEmptyStringForGlobalFilterCustomDefaultValue;
  }
  return value;
};

/**
 * The default decoder of Tanstack Table's `globalFilter`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeGlobalFilter = (
  value: Query[string],
  options?: {
    defaultValue?: TanstackTableState["globalFilter"];
  },
): TanstackTableState["globalFilter"] | undefined => {
  const defaultValue = options?.defaultValue;
  if (typeof value !== "string") {
    return defaultValue;
  }
  if (value === encodedEmptyStringForGlobalFilterCustomDefaultValue) {
    return defaultValue === ""
      ? encodedEmptyStringForGlobalFilterCustomDefaultValue
      : "";
  }
  return value;
};
