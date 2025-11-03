import type { State as TanstackTableState } from "..";
import type { Query } from "../types";
import { encodedComma, noneStringForCustomDefaultValue } from "./consts";

export const defaultDefaultRowSelection =
  {} as const satisfies TanstackTableState["rowSelection"];

/**
 * The default encoder of Tanstack Table's `rowSelection`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodeRowSelection = (
  value: TanstackTableState["rowSelection"],
  options?: { defaultValue?: TanstackTableState["rowSelection"] },
): Query[string] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultRowSelection;
  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    return undefined;
  }

  // return encoded empty string if stateValue is empty with custom default value
  if (Object.values(value).every((v) => v === false)) {
    return noneStringForCustomDefaultValue;
  }

  return Object.entries(value)
    .filter(([, v]) => v)
    .map(([id]) => id.replaceAll(",", encodedComma))
    .join(",");
};

/**
 * The default decoder of Tanstack Table's `rowSelection`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodeRowSelection = (
  value: Query[string],
  options?: { defaultValue?: TanstackTableState["rowSelection"] },
): TanstackTableState["rowSelection"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultRowSelection;
  if (typeof value !== "string") return defaultValue;
  if (value === "") return defaultValue;
  if (value === noneStringForCustomDefaultValue) {
    return {};
  }

  return Object.fromEntries(
    value.split(",").map((id) => [id.replaceAll(encodedComma, ","), true]),
  );
};
