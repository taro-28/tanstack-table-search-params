import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { expect, test } from "vitest";
import { useTableSearchParams } from "..";
import { defaultPagination } from "../encoder-decoder/pagination";

test("pagination", () => {
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
  expect(result.current.getState().pagination).toEqual(defaultPagination);
  expect(mockRouter.query).toEqual({});

  // set pageIndex
  act(() => result.current.nextPage());
  rerender();
  expect(result.current.getState().pagination).toEqual({
    pageIndex: 1,
    pageSize: 10,
  });

  // set pageSize
  act(() => result.current.setPageSize(20));
  rerender();
  expect(result.current.getState().pagination).toEqual({
    pageIndex: 0,
    pageSize: 20,
  });
});
