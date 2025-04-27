import type { State } from "..";
import type { Query } from "../types";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

/**
 * The default encoder of Tanstack Table's `sorting`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeSorting = (
  value: State["sorting"],
  options?: {
    defaultValue?: State["sorting"];
  },
): Query[string] => {
  const defaultValue = options?.defaultValue;
  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (value.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return value
    .map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
    .join(",");
};

/**
 * The default decoder of Tanstack Table's `sorting`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeSorting = (
  value: Query[string],
  options?: {
    defaultValue?: State["sorting"];
  },
): State["sorting"] | undefined => {
  const defaultValue = options?.defaultValue;
  if (typeof value !== "string") return defaultValue;
  if (value === "") return defaultValue;
  if (value === noneStringForCustomDefaultValue) {
    return [];
  }

  try {
    return value.split(",").map((sort) => {
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
