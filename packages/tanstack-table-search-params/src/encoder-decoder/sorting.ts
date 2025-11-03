import type { State as TanstackTableState } from "..";
import type { Query } from "../types";
import { encodedComma, noneStringForCustomDefaultValue } from "./consts";

export const defaultDefaultSorting =
  [] as const satisfies TanstackTableState["sorting"];

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
  value: TanstackTableState["sorting"],
  options?: { defaultValue?: TanstackTableState["sorting"] },
): Query[string] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultSorting;
  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (value.length === 0) {
    return noneStringForCustomDefaultValue;
  }

  return value
    .map(
      ({ id, desc }) =>
        `${id
          .replaceAll(",", encodedComma)
          .replaceAll(".", "%2E")}.${desc ? "desc" : "asc"}`,
    )
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
  options?: { defaultValue?: TanstackTableState["sorting"] },
): TanstackTableState["sorting"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultSorting;
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
      return {
        id: id.replaceAll(encodedComma, ",").replaceAll("%2E", "."),
        desc: order === "desc",
      };
    });
  } catch {
    return defaultValue;
  }
};
