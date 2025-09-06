import type { State as TanstackTableState } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

export const defaultDefaultColumnOrder =
  [] as const satisfies TanstackTableState["columnOrder"];

/**
 * The default encoder of Tanstack Table's `columnOrder`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeColumnOrder = (
  value: TanstackTableState["columnOrder"],
  options?: { defaultValue?: TanstackTableState["columnOrder"] },
): Query[string] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnOrder;
  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (value.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return value.map((v) => v.replaceAll(",", encodeURIComponent(","))).join(",");
};

/**
 * The default decoder of Tanstack Table's `columnOrder`.
 *
 * @param queryValue - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeColumnOrder = (
  queryValue: Query[string],
  options?: { defaultValue?: TanstackTableState["columnOrder"] },
): TanstackTableState["columnOrder"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnOrder;
  if (typeof queryValue !== "string") return defaultValue;
  if (queryValue === "") return defaultValue;
  if (queryValue === noneStringForCustomDefaultValue) {
    return [];
  }

  return queryValue
    .split(",")
    .map((v) => v.replaceAll(encodeURIComponent(","), ","));
};
