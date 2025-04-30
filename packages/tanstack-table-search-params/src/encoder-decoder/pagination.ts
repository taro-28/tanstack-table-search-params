import type { State as TanstackTableState } from "..";
import type { Query } from "../types";

export const defaultDefaultPagination = {
  pageIndex: 0,
  pageSize: 10,
} as const satisfies TanstackTableState["pagination"];

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
  value: TanstackTableState["pagination"],
  options?: {
    defaultValue?: TanstackTableState["pagination"] | undefined;
  },
): {
  pageIndex: Query[string];
  pageSize: Query[string];
} => {
  const defaultValue = options?.defaultValue ?? defaultDefaultPagination;
  return {
    pageIndex:
      value.pageIndex === defaultValue?.pageIndex
        ? undefined
        : (value.pageIndex + 1).toString(),
    pageSize:
      value.pageSize === defaultValue?.pageSize
        ? undefined
        : value.pageSize.toString(),
  };
};

/**
 * The default decoder of Tanstack Table's `pagination`.
 *
 * @param value - The encoded query parameter value to decode.
 * @param options
 * @param options.defaultValue
 * - If you set [`defaultValues`](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value) in `useTableSearchParams`,
 * you should set the same value.
 *
 * @returns The decoded value.
 */
export const decodePagination = (
  value: {
    pageIndex: Query[string];
    pageSize: Query[string];
  },
  options?: {
    defaultValue?: TanstackTableState["pagination"] | undefined;
  },
): TanstackTableState["pagination"] => {
  const defaultValue = options?.defaultValue ?? defaultDefaultPagination;
  const pageIndex = Number(value.pageIndex);
  const pageSize = Number(value.pageSize);

  return {
    pageIndex:
      value.pageIndex === "" || Number.isNaN(pageIndex) || pageIndex < 1
        ? defaultValue?.pageIndex
        : pageIndex - 1,
    pageSize:
      value.pageSize === "" || Number.isNaN(pageSize)
        ? defaultValue?.pageSize
        : pageSize,
  };
};
