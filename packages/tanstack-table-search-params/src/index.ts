import type { OnChangeFn, TableState } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Query, Router } from "./types";
import { useColumnFilters } from "./useColumnFilters";
import { useGlobalFilter } from "./useGlobalFilter";
import { usePagination } from "./usePagination";
import { useSorting } from "./useSorting";
import type { ExtractSpecificStateOptions } from "./utils";

export type State = Pick<
  TableState,
  "globalFilter" | "sorting" | "pagination" | "columnFilters"
>;

export const PARAM_NAMES = {
  GLOBAL_FILTER: "globalFilter",
  SORTING: "sorting",
  PAGE_INDEX: "pageIndex",
  PAGE_SIZE: "pageSize",
  COLUMN_FILTERS: "columnFilters",
} as const;

export type Returns = {
  state: State;
  onGlobalFilterChange: OnChangeFn<State["globalFilter"]>;
  onSortingChange: OnChangeFn<State["sorting"]>;
  onPaginationChange: OnChangeFn<State["pagination"]>;
  onColumnFiltersChange: OnChangeFn<State["columnFilters"]>;
};

export type Options = {
  defaultValues?: Partial<State>;
  paramNames?: {
    [KEY in keyof State]?: KEY extends "pagination"
      ?
          | {
              pageIndex: string;
              pageSize: string;
            }
          | ((defaultParamName: {
              pageIndex: string;
              pageSize: string;
            }) => { pageIndex: string; pageSize: string })
      : string | ((key: KEY) => string);
  };
  encoders?: {
    [KEY in keyof State]?: (value: State[KEY]) => Query;
  };
  decoders?: {
    [KEY in keyof State]?: (query: Query) => State[KEY];
  };
};

const extractSpecificStateOptions = <KEY extends keyof State>({
  options,
  key,
}: {
  options: Options | undefined;
  key: KEY;
}): ExtractSpecificStateOptions<KEY> =>
  Object.fromEntries(
    Object.entries(options ?? {}).map(([k, v]) => [
      k.replace(/s$/, ""),
      v?.[key],
    ]),
  );

export const useTableSearchParams = (
  {
    push,
    pathname,
    query,
  }: Pick<Router, "push" | "pathname"> & {
    query: Router["query"] | URLSearchParams;
  },
  options?: Options,
): Returns => {
  const router = useMemo(
    () => ({
      push,
      pathname,
      query:
        query instanceof URLSearchParams
          ? Object.fromEntries(query.entries())
          : query,
    }),
    [push, pathname, query],
  );

  const { globalFilter, onGlobalFilterChange } = useGlobalFilter({
    router,
    options: extractSpecificStateOptions({ options, key: "globalFilter" }),
  });
  const { sorting, onSortingChange } = useSorting({
    router,
    options: extractSpecificStateOptions({ options, key: "sorting" }),
  });
  const { pagination, onPaginationChange } = usePagination({
    router,
    options: extractSpecificStateOptions({ options, key: "pagination" }),
  });
  const { columnFilters, onColumnFiltersChange } = useColumnFilters({
    router,
    options: extractSpecificStateOptions({ options, key: "columnFilters" }),
  });

  const state = useMemo(
    () => ({ sorting, pagination, globalFilter, columnFilters }),
    [sorting, pagination, globalFilter, columnFilters],
  );

  return {
    state,
    onGlobalFilterChange,
    onSortingChange,
    onPaginationChange,
    onColumnFiltersChange,
  };
};
