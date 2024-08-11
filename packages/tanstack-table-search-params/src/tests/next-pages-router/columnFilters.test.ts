import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, describe, expect, test } from "vitest";
import { useTableSearchParams } from "../..";

describe("columnFilters", () => {
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
        columnFilters: {
          paramName: "COLUMN_FILTERS",
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        columnFilters: {
          paramName: (key) => `userTable-${key}`,
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        columnFilters: {
          encoder: (columnFilters) => ({
            columnFilters: JSON.stringify(columnFilters),
          }),
          decoder: (query) =>
            query["columnFilters"]
              ? JSON.parse(query["columnFilters"] as string)
              : query["columnFilters"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        columnFilters: {
          encoder: (columnFilters) => ({
            "userTable-columnFilters": JSON.stringify(columnFilters),
          }),
          decoder: (query) =>
            query["userTable-columnFilters"]
              ? JSON.parse(query["userTable-columnFilters"] as string)
              : query["userTable-columnFilters"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        columnFilters: {
          encoder: (columnFilters) =>
            Object.fromEntries(
              columnFilters.map(({ id, value }) => [
                `columnFilters.${id}`,
                JSON.stringify(value),
              ]),
            ),
          decoder: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("columnFilters."))
              .map(([key, value]) => ({
                id: key.replace("columnFilters.", ""),
                value: JSON.parse(value as string),
              })),
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.columnFilters?.paramName === "function"
        ? options.columnFilters.paramName("columnFilters")
        : options?.columnFilters?.paramName || "columnFilters";

    test("single column: string value", () => {
      const { result, rerender } = renderHook(() => {
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

      // initial state
      expect(result.current.getState().columnFilters).toEqual([]);
      expect(mockRouter.query).toEqual({});

      // set string value for column filter
      act(() => result.current.getFlatHeaders()[1]?.column.setFilterValue("J"));
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        { id: "name", value: "J" },
      ]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([{ id: "name", value: "J" }]) ?? {
          [paramName]: "name.%22J%22",
        },
      );

      // reset
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("");
      });
      rerender();
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([]) ?? {},
      );
      expect(result.current.getState().columnFilters).toEqual([]);
    });

    test("single column: array value", () => {
      const { result, rerender } = renderHook(() => {
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

      // initial state
      expect(result.current.getState().columnFilters).toEqual([]);
      expect(mockRouter.query).toEqual({});

      // set array value for column filter
      act(() =>
        result.current.getFlatHeaders()[2]?.column.setFilterValue([30, 40]),
      );
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        { id: "age", value: [30, 40] },
      ]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([{ id: "age", value: [30, 40] }]) ?? {
          [paramName]: "age.%5B30%2C40%5D",
        },
      );

      // reset
      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([]) ?? {},
      );
    });

    test("multiple columns", () => {
      const { result, rerender } = renderHook(() => {
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

      // initial state
      expect(result.current.getState().columnFilters).toEqual([]);
      expect(mockRouter.query).toEqual({});

      // set string value for column filter
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("J");
      });
      rerender();

      expect(result.current.getState().columnFilters).toEqual([
        { id: "name", value: "J" },
      ]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([{ id: "name", value: "J" }]) ?? {
          [paramName]: "name.%22J%22",
        },
      );

      // set array value for column filter
      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([30, 40]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        { id: "name", value: "J" },
        { id: "age", value: [30, 40] },
      ]);

      // reset
      act(() => {
        result.current.getFlatHeaders()[1]?.column.setFilterValue("");
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([
        { id: "age", value: [30, 40] },
      ]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([{ id: "age", value: [30, 40] }]) ?? {
          [paramName]: "age.%5B30%2C40%5D",
        },
      );

      act(() => {
        result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
      });
      rerender();
      expect(result.current.getState().columnFilters).toEqual([]);
      expect(mockRouter.query).toEqual(
        options?.columnFilters?.encoder?.([]) ?? {},
      );
    });
  });
});
