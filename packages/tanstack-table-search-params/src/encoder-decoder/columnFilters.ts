import type { State, State as TanstackTableState } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

export const defaultDefaultColumnFilters =
  [] as const satisfies State["columnFilters"];

/**
 * The default encoder of Tanstack Table's `columnFilters`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeColumnFilters = (
  value: TanstackTableState["columnFilters"],
  options?: {
    defaultValue?: TanstackTableState["columnFilters"];
  },
): Query[string] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnFilters;
  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (value.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return value
    .map(
      ({ id, value }) =>
        `${id}.${encodeURIComponent(JSON.stringify(value)).replaceAll(".", "%2E")}`,
    )
    .join(",");
};

/**
 * The default decoder of Tanstack Table's `columnFilters`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeColumnFilters = (
  value: Query[string],
  options?: {
    defaultValue?: TanstackTableState["columnFilters"];
  },
): TanstackTableState["columnFilters"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultColumnFilters;
  if (typeof value !== "string") return defaultValue;
  if (value === "") return defaultValue;
  if (value === noneStringForCustomDefaultValue) {
    return [];
  }

  try {
    return value
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
