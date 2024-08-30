import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTableSearchParams } from "../..";
import { defaultDefaultColumnFilters } from "../../useColumnFilters";

describe("columnFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    mockRouter.query = {};
  });
  describe.each<{
    name: string;
    options?: Parameters<typeof useTableSearchParams>[1];
  }>([
    {
      name: "no options",
    },
    {
      name: "with options: string param name",
      options: {
        paramNames: {
          columnFilters: "COLUMN_FILTERS",
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        paramNames: {
          columnFilters: (key) => `userTable-${key}`,
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          columnFilters: (columnFilters) => ({
            columnFilters: JSON.stringify(columnFilters),
          }),
        },
        decoders: {
          columnFilters: (query) =>
            query["columnFilters"]
              ? JSON.parse(query["columnFilters"] as string)
              : query["columnFilters"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          columnFilters: (columnFilters) => ({
            "userTable-columnFilters": JSON.stringify(columnFilters),
          }),
        },
        decoders: {
          columnFilters: (query) =>
            query["userTable-columnFilters"]
              ? JSON.parse(query["userTable-columnFilters"] as string)
              : query["userTable-columnFilters"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          columnFilters: (columnFilters) =>
            Object.fromEntries(
              columnFilters.map(({ id, value }) => [
                `columnFilters.${id}`,
                JSON.stringify(value),
              ]),
            ),
        },
        decoders: {
          columnFilters: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("columnFilters."))
              .map(([key, value]) => ({
                id: key.replace("columnFilters.", ""),
                value: JSON.parse(value as string),
              })),
        },
      },
    },
    {
      name: "with options: custom default value",
      options: {
        defaultValues: {
          columnFilters: [{ id: "custom", value: "default" }],
        },
      },
    },
    {
      name: "with options: custom debounce milliseconds",
      options: {
        debounceMilliseconds: {
          columnFilters: 1,
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.columnFilters === "function"
        ? options?.paramNames?.columnFilters("columnFilters")
        : options?.paramNames?.columnFilters || "columnFilters";

    const defaultColumnFilters =
      options?.defaultValues?.columnFilters ?? defaultDefaultColumnFilters;

    test("single column: string value", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: [{ accessorKey: "id" }, { accessorKey: "name" }],
          data: [
            { id: 0, name: "John" },
            { id: 1, name: "Mary" },
          ],
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (options?.debounceMilliseconds?.columnFilters) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.columnFilters);
        }
        resultRerender();
      };

      // initial state
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
      expect(mockRouter.query).toEqual({});

      // set string value for column filter
      act(() => result.current.getFlatHeaders()[1]?.column.setFilterValue("J"));
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        ...defaultColumnFilters,
        { id: "name", value: "J" },
      ]);
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([{ id: "name", value: "J" }]) ?? {
          [paramName]:
            defaultColumnFilters.length === 0
              ? "name.%22J%22"
              : "custom.%22default%22,name.%22J%22",
        },
      );

      // reset
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("");
      });
      rerender();
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([]) ?? {},
      );
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
    });

    test("single column: array value", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: [
            { accessorKey: "id" },
            { accessorKey: "name" },
            { accessorKey: "age" },
          ],
          data: [
            { id: 0, name: "John", age: 20 },
            { id: 1, name: "Mary", age: 30 },
            { id: 2, name: "Jane", age: 40 },
            { id: 3, name: "John", age: 50 },
          ],
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (options?.debounceMilliseconds?.columnFilters) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.columnFilters);
        }
        resultRerender();
      };

      // initial state
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
      expect(mockRouter.query).toEqual({});

      // set array value for column filter
      act(() =>
        result.current.getFlatHeaders()[2]?.column.setFilterValue([30, 40]),
      );
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        ...defaultColumnFilters,
        { id: "age", value: [30, 40] },
      ]);
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([
          { id: "age", value: [30, 40] },
        ]) ?? {
          [paramName]:
            defaultColumnFilters.length === 0
              ? "age.%5B30%2C40%5D"
              : "custom.%22default%22,age.%5B30%2C40%5D",
        },
      );

      // reset
      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([]) ?? {},
      );
    });

    test("multiple columns", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: [
            { accessorKey: "id" },
            { accessorKey: "name" },
            { accessorKey: "age" },
          ],
          data: [
            { id: 0, name: "John", age: 20 },
            { id: 1, name: "Mary", age: 30 },
            { id: 2, name: "Jane", age: 40 },
            { id: 3, name: "John", age: 50 },
          ],
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (options?.debounceMilliseconds?.columnFilters) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.columnFilters);
        }
        resultRerender();
      };

      // initial state
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
      expect(mockRouter.query).toEqual({});

      // set string value for column filter
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("J");
      });
      rerender();

      expect(result.current.getState().columnFilters).toEqual([
        ...defaultColumnFilters,
        { id: "name", value: "J" },
      ]);
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([{ id: "name", value: "J" }]) ?? {
          [paramName]:
            defaultColumnFilters.length === 0
              ? "name.%22J%22"
              : "custom.%22default%22,name.%22J%22",
        },
      );

      // set array value for column filter
      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([30, 40]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        ...defaultColumnFilters,
        { id: "name", value: "J" },
        { id: "age", value: [30, 40] },
      ]);

      // reset
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("");
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        ...defaultColumnFilters,
        { id: "age", value: [30, 40] },
      ]);
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([
          { id: "age", value: [30, 40] },
        ]) ?? {
          [paramName]:
            defaultColumnFilters.length === 0
              ? "age.%5B30%2C40%5D"
              : "custom.%22default%22,age.%5B30%2C40%5D",
        },
      );

      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual(
        defaultColumnFilters,
      );
      expect(mockRouter.query).toEqual(
        options?.encoders?.columnFilters?.([]) ?? {},
      );
    });
  });
});
