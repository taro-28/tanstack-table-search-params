import {
  functionalUpdate,
  type OnChangeFn,
  type TableState,
  type Updater,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useColumnFilters } from "./useColumnFilters";
import { useColumnOrder } from "./useColumnOrder";
import { useColumnVisibility } from "./useColumnVisibility";
import { useGlobalFilter } from "./useGlobalFilter";
import { usePagination } from "./usePagination";
import { useRowSelection } from "./useRowSelection";
import { useSorting } from "./useSorting";
import type { ExtractSpecificStateOptions } from "./utils";

export type State = Pick<
  TableState,
  | "globalFilter"
  | "sorting"
  | "pagination"
  | "columnFilters"
  | "columnOrder"
  | "rowSelection"
  | "columnVisibility"
>;

export const PARAM_NAMES = {
  GLOBAL_FILTER: "globalFilter",
  SORTING: "sorting",
  PAGE_INDEX: "pageIndex",
  PAGE_SIZE: "pageSize",
  COLUMN_FILTERS: "columnFilters",
  COLUMN_ORDER: "columnOrder",
  ROW_SELECTION: "rowSelection",
  COLUMN_VISIBILITY: "columnVisibility",
} as const;

export type Returns = {
  /**
   * Tanstack Table's state
   */
  state: State;
  /**
   * Tanstack Table's `onChangeGlobalFilter` function
   */
  onGlobalFilterChange: OnChangeFn<State["globalFilter"]>;
  /**
   * Tanstack Table's `onChangeSorting` function
   */
  onSortingChange: OnChangeFn<State["sorting"]>;
  /**
   * Tanstack Table's `onChangePagination` function
   */
  onPaginationChange: OnChangeFn<State["pagination"]>;
  /**
   * Tanstack Table's `onChangeColumnFilters` function
   */
  onColumnFiltersChange: OnChangeFn<State["columnFilters"]>;
  /**
   * Tanstack Table's `onChangeColumnOrder` function
   */
  onColumnOrderChange: OnChangeFn<State["columnOrder"]>;
  /**
   * Tanstack Table's `onChangeRowSelection` function
   */
  onRowSelectionChange: OnChangeFn<State["rowSelection"]>;
  /**
   * Tanstack Table's `onChangeColumnVisibility` function
   */
  onColumnVisibilityChange: OnChangeFn<State["columnVisibility"]>;
  onStateChange: (updater: Updater<TableState>) => void;
};

export type Options = {
  /**
   * The custom names of query parameters.
   *
   * @link [README](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-query-param-name)
   */
  paramNames?: {
    [KEY in keyof State]?: KEY extends "pagination"
      ?
          | { pageIndex: string; pageSize: string }
          | ((defaultParamName: { pageIndex: string; pageSize: string }) => {
              pageIndex: string;
              pageSize: string;
            })
      : string | ((key: KEY) => string);
  };
  /**
   * The default values of a query parameter.
   *
   * The "default value" is the value that is used as the `state` when the query parameter is not present.
   *
   * @link [README](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-default-value)
   */
  defaultValues?: Partial<State>;
  /**
   * The custom encoders of query parameters.
   *
   * It is used with the `decoders` option.
   *
   * @link [README](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-encoder-decoder)
   */
  encoders?: {
    [KEY in keyof State]?: (value: State[KEY]) => Query;
  };
  /**
   * The custom decoders of query parameters.
   *
   * It is used with the `encoders` option.
   *
   * @link [README](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#custom-encoder-decoder)
   */
  decoders?: {
    [KEY in keyof State]?: (query: Query) => State[KEY];
  };
  /**
   * The debounce milliseconds of a query parameter.
   *
   * @link [README](https://github.com/taro-28/tanstack-table-search-params?tab=readme-ov-file#debounce)
   */
  debounceMilliseconds?:
    | {
        [KEY in keyof State]?: number;
      }
    | number;
};

const regex = /s$/;

const extractSpecificStateOptions = <KEY extends keyof State>({
  options,
  key,
}: {
  options: Options | undefined;
  key: KEY;
}): ExtractSpecificStateOptions<KEY> =>
  Object.fromEntries(
    options
      ? Object.entries(options).map(([k, v]) => [
          k === "debounceMilliseconds" ? k : k.replace(regex, ""),
          typeof v === "object" ? v?.[key] : v,
        ])
      : [],
  );

type Props = {
  /**
   * search params state
   *
   * It is used to decode and create the `state` of the Tanstack Table.
   */
  query: Router["query"] | URLSearchParams;
  /**
   * It is used for calling `push`(or `replace`).
   */
  pathname: Router["pathname"];
} & (
  | {
      /**
       * It is used to create a function like onChangeGlobalFilter that encodes state as a query parameter and performs a replace navigation.
       *
       * If both `push` and `replace` are provided, replace will be used.
       */
      replace: Router["navigate"];
    }
  | {
      /**
       * It is used to create a function like onChangeGlobalFilter that encodes state as a query parameter and performs a push navigation.
       *
       * If both `push` and `replace` are provided, replace will be used.
       */
      push: Router["navigate"];
    }
);

export const useTableSearchParams = (
  { pathname, query, ...props }: Props,
  options?: Options,
): Returns => {
  const useReplace = "replace" in props;
  const navigate = useReplace ? props.replace : props.push;
  const router = useMemo(
    () => ({
      navigate,
      pathname,
      query:
        query instanceof URLSearchParams
          ? Object.fromEntries(query.entries())
          : query,
    }),
    [pathname, query, navigate],
  );

  const { globalFilter, globalFilterEncoder, onGlobalFilterChange } =
    useGlobalFilter({
      router,
      options: extractSpecificStateOptions({ options, key: "globalFilter" }),
    });
  const { sorting, sortingEncoder, onSortingChange } = useSorting({
    router,
    options: extractSpecificStateOptions({ options, key: "sorting" }),
  });
  const { pagination, paginationEncoder, onPaginationChange } = usePagination({
    router,
    options: extractSpecificStateOptions({ options, key: "pagination" }),
  });
  const { columnFilters, columnFiltersEncoder, onColumnFiltersChange } =
    useColumnFilters({
      router,
      options: extractSpecificStateOptions({ options, key: "columnFilters" }),
    });
  const { columnOrder, columnOrderEncoder, onColumnOrderChange } =
    useColumnOrder({
      router,
      options: extractSpecificStateOptions({ options, key: "columnOrder" }),
    });
  const { rowSelection, rowSelectionEncoder, onRowSelectionChange } =
    useRowSelection({
      router,
      options: extractSpecificStateOptions({ options, key: "rowSelection" }),
    });
  const {
    columnVisibility,
    columnVisibilityEncoder,
    onColumnVisibilityChange,
  } = useColumnVisibility({
    router,
    options: extractSpecificStateOptions({ options, key: "columnVisibility" }),
  });

  const state = useMemo(
    () => ({
      sorting,
      pagination,
      globalFilter,
      columnFilters,
      columnOrder,
      rowSelection,
      columnVisibility,
    }),
    [
      sorting,
      pagination,
      globalFilter,
      columnFilters,
      columnOrder,
      rowSelection,
      columnVisibility,
    ],
  );

  const onStateChange: Returns["onStateChange"] = useCallback(
    async (updater) => {
      const newState = functionalUpdate(updater, {
        ...state,
        columnVisibility: {},
        columnPinning: {},
        rowPinning: {},
        expanded: {},
        columnSizing: {},
        grouping: [],
        columnSizingInfo: {
          columnSizingStart: [],
          deltaOffset: null,
          deltaPercentage: null,
          isResizingColumn: false,
          startOffset: null,
          startSize: null,
        },
      });
      const encodeState = (state: State) => ({
        ...globalFilterEncoder(state.globalFilter),
        ...sortingEncoder(state.sorting),
        ...paginationEncoder(state.pagination),
        ...columnFiltersEncoder(state.columnFilters),
        ...columnOrderEncoder(state.columnOrder),
        ...rowSelectionEncoder(state.rowSelection),
        ...columnVisibilityEncoder(state.columnVisibility),
      });
      await updateQuery({
        oldQuery: encodeState(state),
        newQuery: encodeState(newState),
        router,
      });
    },
    [
      state,
      router,
      globalFilterEncoder,
      sortingEncoder,
      paginationEncoder,
      columnFiltersEncoder,
      columnOrderEncoder,
      rowSelectionEncoder,
      columnVisibilityEncoder,
    ],
  );

  return {
    state,
    onGlobalFilterChange,
    onSortingChange,
    onPaginationChange,
    onColumnFiltersChange,
    onColumnOrderChange,
    onRowSelectionChange,
    onColumnVisibilityChange,
    onStateChange,
  };
};
