import type { OnChangeFn, TableState } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Query, Router } from "./types";
import { useColumnFilters } from "./useColumnFilters";
import { useGlobalFilter } from "./useGlobalFilter";
import { usePagination } from "./usePagination";
import { useRouter } from "./useRouter";
import { useSorting } from "./useSorting";

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

type Returns = {
  state: State;
  onGlobalFilterChange: OnChangeFn<State["globalFilter"]>;
  onSortingChange: OnChangeFn<State["sorting"]>;
  onPaginationChange: OnChangeFn<State["pagination"]>;
  onColumnFiltersChange: OnChangeFn<State["columnFilters"]>;
};

export type Options = {
  [KEY in keyof State]?: {
    paramName?: KEY extends "pagination"
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
    encoder?: (value: State[KEY]) => Query;
    decoder?: (query: Query) => State[KEY];
  };
};

export const useTableSearchParams = (
  {
    push,
    pathname,
    query,
  }: Pick<Router, "push"> & {
    pathname?: string;
    query?: Router["query"] | URLSearchParams;
  },
  options?: Options,
): Returns => {
  const internalRouter = useRouter();
  const router = useMemo(
    () => ({
      push,
      pathname: pathname ?? internalRouter.pathname,
      query: query
        ? query instanceof URLSearchParams
          ? Object.fromEntries(query.entries())
          : query
        : internalRouter.query,
    }),
    [push, pathname, query, internalRouter.pathname, internalRouter.query],
  );

  const { globalFilter, onGlobalFilterChange } = useGlobalFilter({
    router,
    options: options?.globalFilter,
  });
  const { sorting, onSortingChange } = useSorting({
    router,
    options: options?.sorting,
  });
  const { pagination, onPaginationChange } = usePagination({
    router,
    options: options?.pagination,
  });
  const { columnFilters, onColumnFiltersChange } = useColumnFilters({
    router,
    options: options?.columnFilters,
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
