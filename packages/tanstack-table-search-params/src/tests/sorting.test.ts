import { act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { describe, expect, test } from "vitest";
import { useTableSearchParams } from "..";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { renderHook } from "@testing-library/react";

describe("sorting", () => {
  test("single column", () => {
    const { result, rerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter);
      return useReactTable({
        columns: [{ accessorKey: "id" }, { accessorKey: "name" }],
        data: [
          { id: 0, name: "John" },
          { id: 1, name: "Jane" },
        ],
        getCoreRowModel: getCoreRowModel(),
        ...stateAndOnChanges,
      });
    });

    // initial state
    expect(result.current.getState().sorting).toEqual([]);
    expect(mockRouter.query).toEqual({});

    // sort by first column
    act(() =>
      result.current.getFlatHeaders()[0]?.column.getToggleSortingHandler()?.(
        {},
      ),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "id", desc: true },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "id.desc" });

    // sort by first column again
    act(() =>
      result.current.getFlatHeaders()[0]?.column.getToggleSortingHandler()?.(
        {},
      ),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "id", desc: false },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "id.asc" });

    // sort by another column
    act(() =>
      result.current.getFlatHeaders()[1]?.column.getToggleSortingHandler()?.(
        {},
      ),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "name", desc: false },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "name.asc" });

    // reset
    act(() => {
      result.current.getFlatHeaders()[1]?.column.getToggleSortingHandler()?.(
        {},
      );
    });
    rerender();
    act(() => {
      result.current.getFlatHeaders()[1]?.column.getToggleSortingHandler()?.(
        {},
      );
    });
    rerender();
    expect(result.current.getState().sorting).toEqual([]);
    expect(mockRouter.query).toEqual({});
  });

  test("multiple columns", () => {
    const { result, rerender } = renderHook(() => {
      const stateAndOnChanges = useTableSearchParams(mockRouter);
      return useReactTable({
        columns: [{ accessorKey: "id" }, { accessorKey: "name" }],
        data: [
          { id: 0, name: "John" },
          { id: 1, name: "Jane" },
        ],
        getCoreRowModel: getCoreRowModel(),
        ...stateAndOnChanges,
      });
    });

    // initial state
    expect(result.current.getState().sorting).toEqual([]);
    expect(mockRouter.query).toEqual({});

    // sort by first column and another column
    act(() =>
      result.current.getFlatHeaders()[0]?.column.getToggleSortingHandler()?.(
        {},
      ),
    );
    rerender();
    act(() =>
      result.current.getFlatHeaders()[1]?.column.getToggleSortingHandler()?.({
        shiftKey: true,
      }),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "id", desc: true },
      { id: "name", desc: false },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "id.desc,name.asc" });

    // sort by first column again
    act(() =>
      result.current.getFlatHeaders()[0]?.column.getToggleSortingHandler()?.({
        shiftKey: true,
      }),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "id", desc: false },
      { id: "name", desc: false },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "id.asc,name.asc" });

    // sort by another column again
    act(() =>
      result.current.getFlatHeaders()[0]?.column.getToggleSortingHandler()?.(
        {},
      ),
    );
    rerender();
    expect(result.current.getState().sorting).toEqual([
      { id: "id", desc: false },
    ]);
    expect(mockRouter.query).toEqual({ sorting: "id.asc" });
  });
});
