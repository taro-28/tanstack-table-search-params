import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { describe, expect, test } from "vitest";
import { useTableSearchParams } from "..";

describe("columnFilters", () => {
  test("single column: string value", () => {
    const { result, rerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter);
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
    expect(mockRouter.query).toEqual({ columnFilters: "name.%22J%22" });

    // reset
    act(() => {
      result.current.getFlatHeaders()[1]?.column.setFilterValue("");
    });
    rerender();
    expect(result.current.getState().columnFilters).toEqual([]);
    expect(mockRouter.query).toEqual({});
  });

  test("single column: array value", () => {
    const { result, rerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter);
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
    expect(mockRouter.query).toEqual({ columnFilters: "age.%5B30%2C40%5D" });

    // reset
    act(() => {
      result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
    });
    rerender();
    expect(result.current.getState().columnFilters).toEqual([]);
    expect(mockRouter.query).toEqual({});
  });

  test("multiple columns", () => {
    const { result, rerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter);
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
    expect(mockRouter.query).toEqual({
      columnFilters: "name.%22J%22",
    });

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
    expect(mockRouter.query).toEqual({
      columnFilters: "age.%5B30%2C40%5D",
    });

    act(() => {
      result.current.getFlatHeaders()[2]?.column.setFilterValue([]);
    });
    rerender();
    expect(result.current.getState().columnFilters).toEqual([]);
    expect(mockRouter.query).toEqual({});
  });
});
