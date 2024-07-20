import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { expect, test } from "vitest";
import { useTableSearchParams } from "..";

test("globalFilter", () => {
  const { result, rerender } = renderHook(() => {
    const stateAndOnChanges = useTableSearchParams(mockRouter);
    return useReactTable({
      columns: [],
      data: [],
      getCoreRowModel: getCoreRowModel(),
      ...stateAndOnChanges,
    });
  });

  // initial state
  expect(result.current.getState().globalFilter).toBe("");
  expect(mockRouter.query).toEqual({});

  // set
  act(() => result.current.setGlobalFilter("John"));
  rerender();
  expect(result.current.getState().globalFilter).toBe("John");
  expect(mockRouter.query).toEqual({ globalFilter: "John" });

  // reset
  act(() => result.current.setGlobalFilter(""));
  rerender();
  expect(result.current.getState().globalFilter).toBe("");
  expect(mockRouter.query).toEqual({});
});
