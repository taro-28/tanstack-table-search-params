import type { State as TanstackTableState } from "..";
import type { Query } from "../types";

/**
 * The default encoder of Tanstack Table's `pagination`.
 *
 * @param value - The value to encode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The encoded query parameter value.
 */
export const encodePagination = (
  stateValue: TanstackTableState["pagination"],
  options?: {
    defaultValue?: TanstackTableState["pagination"];
  },
): {
  pageIndex: Query[string];
  pageSize: Query[string];
} => {
  const defaultValue = options?.defaultValue;
  return {
    pageIndex:
      stateValue.pageIndex === defaultValue?.pageIndex
        ? undefined
        : (stateValue.pageIndex + 1).toString(),
    pageSize:
      stateValue.pageSize === defaultValue?.pageSize
        ? undefined
        : stateValue.pageSize.toString(),
  };
};

/**
 * The default decoder of Tanstack Table's `pagination`.
 *
 * @param queryValues - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodePagination = (
  queryValues: {
    pageIndex: Query[string];
    pageSize: Query[string];
  },
  options?: {
    defaultValue?: TanstackTableState["pagination"];
  },
):
  | TanstackTableState["pagination"]
  | { pageIndex: number | undefined; pageSize: number | undefined } => {
  const defaultValue = options?.defaultValue;
  const pageIndex = Number(queryValues.pageIndex);
  const pageSize = Number(queryValues.pageSize);

  return {
    pageIndex:
      queryValues.pageIndex === "" || Number.isNaN(pageIndex) || pageIndex < 1
        ? defaultValue?.pageIndex
        : pageIndex - 1,
    pageSize:
      queryValues.pageSize === "" || Number.isNaN(pageSize)
        ? defaultValue?.pageSize
        : pageSize,
  };
};
