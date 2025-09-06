import type { State as TanstackTableState } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

export const defaultDefaultColumnVisibility =
  {} as const satisfies TanstackTableState["columnVisibility"];

const extractFalseProperties = (
  value: TanstackTableState["columnVisibility"],
) => Object.fromEntries(Object.entries(value).filter(([, v]) => !v));

/**
 * The default encoder of Tanstack Table's `columnVisibility`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeColumnVisibility = (
  value: TanstackTableState["columnVisibility"],
  options?: { defaultValue?: TanstackTableState["columnVisibility"] },
): Query[string] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnVisibility;
  const extractedValue = extractFalseProperties(value);
  if (
    JSON.stringify(extractedValue) ===
    JSON.stringify(extractFalseProperties(defaultValue))
  ) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (Object.keys(extractedValue).length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return Object.entries(extractedValue)
    .map(([id]) => id)
    .join(",");
};

/**
 * The default decoder of Tanstack Table's `columnVisibility`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeColumnVisibility = (
  value: Query[string],
  options?: { defaultValue?: TanstackTableState["columnVisibility"] },
): TanstackTableState["columnVisibility"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnVisibility;
  if (typeof value !== "string") return defaultValue;
  if (value === "") return defaultValue;
  if (value === noneStringForCustomDefaultValue) {
    return {};
  }

  return Object.fromEntries(value.split(",").map((id) => [id, false]));
};
