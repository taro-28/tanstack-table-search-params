import {
  getCoreRowModel,
  type TableState,
  useReactTable,
} from "@tanstack/react-table";
import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type State, useTableSearchParams } from "../..";
import {
  defaultDefaultGlobalFilter,
  encodedEmptyStringForGlobalFilterCustomDefaultValue,
} from "../../encoder-decoder/globalFilter";
import { noneStringForCustomDefaultValue } from "../../encoder-decoder/noneStringForCustomDefaultValue";
import { defaultDefaultPagination } from "../../encoder-decoder/pagination";

const emptyState: TableState = {
  globalFilter: "",
  sorting: [],
  columnFilters: [],
  columnOrder: [],
  rowSelection: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  columnPinning: { left: [], right: [] },
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
  rowPinning: { bottom: [], top: [] },
  columnVisibility: {},
};

describe("onStateChange", () => {
  beforeEach(vi.useFakeTimers);
  afterEach(() => {
    mockRouter.query = {};
  });
  test.each<{
    name: string;
    options?: Parameters<typeof useTableSearchParams>[1];
  }>([
    { name: "no options" },
    {
      name: "with options: string param name",
      options: {
        paramNames: {
          globalFilter: "GLOBAL_FILTER",
          sorting: "SORTING",
          columnFilters: "COLUMN_FILTERS",
          columnOrder: "COLUMN_ORDER",
          rowSelection: "ROW_SELECTION",
          columnVisibility: "COLUMN_VISIBILITY",
          pagination: {
            pageIndex: "PAGE_INDEX",
            pageSize: "PAGE_SIZE",
          },
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        paramNames: {
          globalFilter: (key) => `userTable-${key}`,
          sorting: (key) => `userTable-${key}`,
          columnFilters: (key) => `userTable-${key}`,
          columnOrder: (key) => `userTable-${key}`,
          rowSelection: (key) => `userTable-${key}`,
          columnVisibility: (key) => `userTable-${key}`,
          pagination: ({ pageIndex, pageSize }) => ({
            pageIndex: `userTable-${pageIndex}`,
            pageSize: `userTable-${pageSize}`,
          }),
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          globalFilter: (globalFilter = "") => ({
            globalFilter: JSON.stringify(globalFilter),
          }),
          sorting: (sorting) => ({
            sorting: JSON.stringify(sorting),
          }),
          columnFilters: (columnFilters) => ({
            columnFilters: JSON.stringify(columnFilters),
          }),
          columnOrder: (columnOrder) => ({
            columnOrder: JSON.stringify(columnOrder),
          }),
          rowSelection: (rowSelection) => ({
            rowSelection: JSON.stringify(rowSelection),
          }),
          columnVisibility: (columnVisibility) => ({
            columnVisibility: JSON.stringify(columnVisibility),
          }),
          pagination: (pagination) => ({
            pageIndex: JSON.stringify(pagination.pageIndex),
            pageSize: JSON.stringify(pagination.pageSize),
          }),
        },
        decoders: {
          globalFilter: (query) =>
            query["globalFilter"]
              ? JSON.parse(query["globalFilter"] as string)
              : (query["globalFilter"] ?? ""),
          sorting: (query) =>
            query["sorting"]
              ? JSON.parse(query["sorting"] as string)
              : query["sorting"],
          columnFilters: (query) =>
            query["columnFilters"]
              ? JSON.parse(query["columnFilters"] as string)
              : query["columnFilters"],
          columnOrder: (query) =>
            query["columnOrder"]
              ? JSON.parse(query["columnOrder"] as string)
              : query["columnOrder"],
          rowSelection: (query) =>
            query["rowSelection"]
              ? JSON.parse(query["rowSelection"] as string)
              : query["rowSelection"],
          columnVisibility: (query) =>
            query["columnVisibility"]
              ? JSON.parse(query["columnVisibility"] as string)
              : query["columnVisibility"],
          pagination: (query) => ({
            pageIndex: query["pageIndex"]
              ? JSON.parse(query["pageIndex"] as string)
              : defaultDefaultPagination.pageIndex,
            pageSize: query["pageSize"]
              ? JSON.parse(query["pageSize"] as string)
              : defaultDefaultPagination.pageSize,
          }),
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          globalFilter: (globalFilter = "") => ({
            "userTable-globalFilter": JSON.stringify(globalFilter),
          }),
          sorting: (sorting) => ({
            "userTable-sorting": JSON.stringify(sorting),
          }),
          columnFilters: (columnFilters) => ({
            "userTable-columnFilters": JSON.stringify(columnFilters),
          }),
          columnOrder: (columnOrder) => ({
            "userTable-columnOrder": JSON.stringify(columnOrder),
          }),
          rowSelection: (rowSelection) => ({
            "userTable-rowSelection": JSON.stringify(rowSelection),
          }),
          columnVisibility: (columnVisibility) => ({
            "userTable-columnVisibility": JSON.stringify(columnVisibility),
          }),
          pagination: (pagination) => ({
            "userTable-pageIndex": JSON.stringify(pagination.pageIndex),
            "userTable-pageSize": JSON.stringify(pagination.pageSize),
          }),
        },
        decoders: {
          globalFilter: (query) =>
            query["userTable-globalFilter"]
              ? JSON.parse(query["userTable-globalFilter"] as string)
              : (query["userTable-globalFilter"] ?? ""),
          sorting: (query) =>
            query["userTable-sorting"]
              ? JSON.parse(query["userTable-sorting"] as string)
              : query["userTable-sorting"],
          columnFilters: (query) =>
            query["userTable-columnFilters"]
              ? JSON.parse(query["userTable-columnFilters"] as string)
              : query["userTable-columnFilters"],
          columnOrder: (query) =>
            query["userTable-columnOrder"]
              ? JSON.parse(query["userTable-columnOrder"] as string)
              : query["userTable-columnOrder"],
          rowSelection: (query) =>
            query["userTable-rowSelection"]
              ? JSON.parse(query["userTable-rowSelection"] as string)
              : query["userTable-rowSelection"],
          columnVisibility: (query) =>
            query["userTable-columnVisibility"]
              ? JSON.parse(query["userTable-columnVisibility"] as string)
              : query["userTable-columnVisibility"],
          pagination: (query) => ({
            pageIndex: query["userTable-pageIndex"]
              ? JSON.parse(query["userTable-pageIndex"] as string)
              : defaultDefaultPagination.pageIndex,
            pageSize: query["userTable-pageSize"]
              ? JSON.parse(query["userTable-pageSize"] as string)
              : defaultDefaultPagination.pageSize,
          }),
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          sorting: (sorting) =>
            Object.fromEntries(
              sorting.map(({ id, desc }) => [
                `sorting.${id}`,
                desc ? "desc" : "asc",
              ]),
            ),
          columnFilters: (columnFilters) =>
            Object.fromEntries(
              columnFilters.map(({ id, value }) => [
                `columnFilters.${id}`,
                JSON.stringify(value),
              ]),
            ),
          columnOrder: (columnOrder) =>
            Object.fromEntries(
              columnOrder.map((value, i) => [
                `columnOrder.${i}`,
                JSON.stringify(value),
              ]),
            ),
          rowSelection: (rowSelection) =>
            Object.fromEntries(
              Object.keys(rowSelection).map((id) => [
                `rowSelection.${id}`,
                "true",
              ]),
            ),
          columnVisibility: (columnVisibility) =>
            Object.fromEntries(
              Object.entries(columnVisibility).map(([id, value]) => [
                `columnVisibility.${id}`,
                value ? "true" : "false",
              ]),
            ),
          pagination: (pagination) => ({
            pagination: JSON.stringify(pagination),
          }),
        },
        decoders: {
          sorting: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("sorting."))
              .map(([key, desc]) => ({
                id: key.replace("sorting.", ""),
                desc: desc === "desc",
              })),
          columnFilters: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("columnFilters."))
              .map(([key, value]) => ({
                id: key.replace("columnFilters.", ""),
                value: JSON.parse(value as string),
              })),
          columnOrder: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("columnOrder."))
              .map(([_, value]) => JSON.parse(value as string)),
          rowSelection: (query) =>
            Object.fromEntries(
              Object.entries(query)
                .filter(([key]) => key.startsWith("rowSelection."))
                .map(([key]) => [key.replace("rowSelection.", ""), true]),
            ),
          columnVisibility: (query) =>
            Object.fromEntries(
              Object.entries(query)
                .filter(([key]) => key.startsWith("columnVisibility."))
                .map(([key, value]) => [
                  key.replace("columnVisibility.", ""),
                  value === "true",
                ]),
            ),
          pagination: (query) =>
            query["pagination"]
              ? JSON.parse(query["pagination"] as string)
              : defaultDefaultPagination,
        },
      },
    },
    {
      name: "with options: custom default value",
      options: {
        defaultValues: {
          globalFilter: "default",
          sorting: [{ id: "name", desc: true }],
          columnFilters: [{ id: "custom", value: "default" }],
          columnOrder: ["name", "id"],
          rowSelection: { "1": true },
          columnVisibility: { id: false },
          pagination: { pageIndex: 3, pageSize: 25 },
        },
      },
    },
    {
      name: "with options: debounce milliseconds",
      options: { debounceMilliseconds: 1 },
    },
    {
      name: "with options: custom param name, default value",
      options: {
        paramNames: {
          globalFilter: "GLOBAL_FILTER",
          sorting: "SORTING",
          columnFilters: "COLUMN_FILTERS",
          columnOrder: "COLUMN_ORDER",
          rowSelection: "ROW_SELECTION",
          columnVisibility: "COLUMN_VISIBILITY",
          pagination: { pageIndex: "PAGE_INDEX", pageSize: "PAGE_SIZE" },
        },
        defaultValues: {
          globalFilter: "default",
          sorting: [{ id: "name", desc: true }],
          columnFilters: [{ id: "custom", value: "default" }],
          columnOrder: ["name", "id"],
          rowSelection: { "1": true },
          columnVisibility: { id: false },
          pagination: { pageIndex: 3, pageSize: 25 },
        },
      },
    },
  ])("%s", ({ options }) => {
    const getParamName = (
      name: Extract<
        keyof State,
        | "globalFilter"
        | "sorting"
        | "columnFilters"
        | "columnOrder"
        | "rowSelection"
        | "columnVisibility"
      >,
    ) => {
      const paramName = options?.paramNames?.[name];
      return typeof paramName === "function"
        ? paramName(name as never)
        : paramName || name;
    };

    const globalFilterParamName = getParamName("globalFilter");
    const sortingParamName = getParamName("sorting");
    const columnFiltersParamName = getParamName("columnFilters");
    const columnOrderParamName = getParamName("columnOrder");
    const rowSelectionParamName = getParamName("rowSelection");
    const columnVisibilityParamName = getParamName("columnVisibility");
    const paginationParamName =
      typeof options?.paramNames?.pagination === "function"
        ? options.paramNames.pagination({
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          })
        : (options?.paramNames?.pagination ?? {
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          });

    const { result, rerender: resultRerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter, options);
      return useReactTable({
        columns: [],
        data: [],
        getCoreRowModel: getCoreRowModel(),
        ...stateAndOnChanges,
      });
    });

    const defaultGlobalFilter =
      options?.defaultValues?.globalFilter ?? defaultDefaultGlobalFilter;
    const defaultSorting = options?.defaultValues?.sorting ?? [];
    const defaultColumnFilters = options?.defaultValues?.columnFilters ?? [];
    const defaultColumnOrder = options?.defaultValues?.columnOrder ?? [];
    const defaultRowSelection = options?.defaultValues?.rowSelection ?? {};
    const defaultColumnVisibility =
      options?.defaultValues?.columnVisibility ?? {};
    const defaultPagination = options?.defaultValues?.pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    };

    const defaultState: TableState = {
      ...emptyState,
      globalFilter: defaultGlobalFilter,
      sorting: defaultSorting,
      columnFilters: defaultColumnFilters,
      columnOrder: defaultColumnOrder,
      rowSelection: defaultRowSelection,
      columnVisibility: defaultColumnVisibility,
      pagination: defaultPagination,
    };

    // initial state
    expect(result.current.getState()).toStrictEqual(defaultState);
    expect(mockRouter.query).toEqual({});

    const newState: TableState = {
      ...emptyState,
      globalFilter: "John",
      sorting: [{ id: "column1", desc: true }],
      columnFilters: [{ id: "column1", value: "value" }],
      columnOrder: ["column1"],
      rowSelection: { row1: true },
      columnVisibility: { column1: false },
      pagination: { pageIndex: 1, pageSize: 20 },
    };

    const rerender = () => {
      if (typeof options?.debounceMilliseconds === "number") {
        vi.advanceTimersByTime(options.debounceMilliseconds);
      }
      resultRerender();
    };

    act(() => result.current.setState(newState));
    rerender();
    expect(result.current.getState()).toStrictEqual(newState);
    expect(mockRouter.query).toEqual({
      ...(options?.encoders?.globalFilter?.(newState.globalFilter) ?? {
        [globalFilterParamName]: newState.globalFilter,
      }),
      ...(options?.encoders?.sorting?.(newState.sorting) ?? {
        [sortingParamName]: "column1.desc",
      }),
      ...(options?.encoders?.columnFilters?.(newState.columnFilters) ?? {
        [columnFiltersParamName]: "column1.%22value%22",
      }),
      ...(options?.encoders?.columnOrder?.(newState.columnOrder) ?? {
        [columnOrderParamName]: "column1",
      }),
      ...(options?.encoders?.rowSelection?.(newState.rowSelection) ?? {
        [rowSelectionParamName]: "row1",
      }),
      ...(options?.encoders?.columnVisibility?.(newState.columnVisibility) ?? {
        [columnVisibilityParamName]: "column1",
      }),
      ...(options?.encoders?.pagination?.(newState.pagination) ?? {
        [paginationParamName.pageIndex]: `${newState.pagination.pageIndex + 1}`,
        [paginationParamName.pageSize]: `${newState.pagination.pageSize}`,
      }),
    });

    act(() => result.current.reset());
    rerender();

    expect(result.current.getState()).toStrictEqual(emptyState);
    expect(mockRouter.query).toEqual({
      ...(options?.encoders?.globalFilter?.("") ?? {
        [globalFilterParamName]: defaultGlobalFilter
          ? encodedEmptyStringForGlobalFilterCustomDefaultValue
          : undefined,
      }),
      ...(options?.encoders?.sorting?.([]) ?? {
        [sortingParamName]:
          defaultSorting.length > 0
            ? noneStringForCustomDefaultValue
            : undefined,
      }),
      ...(options?.encoders?.columnFilters?.([]) ?? {
        [columnFiltersParamName]:
          defaultColumnFilters.length > 0
            ? noneStringForCustomDefaultValue
            : undefined,
      }),
      ...(options?.encoders?.columnOrder?.([]) ?? {
        [columnOrderParamName]:
          defaultColumnOrder.length > 0
            ? noneStringForCustomDefaultValue
            : undefined,
      }),
      ...(options?.encoders?.rowSelection?.({}) ?? {
        [rowSelectionParamName]:
          Object.keys(defaultRowSelection).length > 0
            ? noneStringForCustomDefaultValue
            : undefined,
      }),
      ...(options?.encoders?.columnVisibility?.(defaultColumnVisibility) ?? {
        [columnVisibilityParamName]:
          Object.keys(defaultColumnVisibility).length > 0
            ? noneStringForCustomDefaultValue
            : undefined,
      }),
      ...(options?.encoders?.pagination?.(defaultPagination) ??
        (options?.defaultValues?.pagination
          ? {
              [paginationParamName.pageIndex]: "1",
              [paginationParamName.pageSize]: "10",
            }
          : {})),
    });
  });
});
