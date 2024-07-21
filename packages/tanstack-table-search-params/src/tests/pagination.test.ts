import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, describe, expect, test } from "vitest";
import { useTableSearchParams } from "..";
import { defaultPagination } from "../encoder-decoder/pagination";

describe("pagination", () => {
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
        pagination: {
          paramName: {
            pageIndex: "PAGE_INDEX",
            pageSize: "PAGE_SIZE",
          },
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        pagination: {
          paramName: ({ pageIndex, pageSize }) => ({
            pageIndex: `userTable-${pageIndex}`,
            pageSize: `userTable-${pageSize}`,
          }),
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        pagination: {
          encoder: (pagination) => ({
            pageIndex: JSON.stringify(pagination.pageIndex),
            pageSize: JSON.stringify(pagination.pageSize),
          }),
          decoder: (query) => ({
            pageIndex: query["pageIndex"]
              ? JSON.parse(query["pageIndex"] as string)
              : defaultPagination.pageIndex,
            pageSize: query["pageSize"]
              ? JSON.parse(query["pageSize"] as string)
              : defaultPagination.pageSize,
          }),
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        pagination: {
          encoder: (pagination) => ({
            "userTable-pageIndex": JSON.stringify(pagination.pageIndex),
            "userTable-pageSize": JSON.stringify(pagination.pageSize),
          }),
          decoder: (query) => ({
            pageIndex: query["userTable-pageIndex"]
              ? JSON.parse(query["userTable-pageIndex"] as string)
              : defaultPagination.pageIndex,
            pageSize: query["userTable-pageSize"]
              ? JSON.parse(query["userTable-pageSize"] as string)
              : defaultPagination.pageSize,
          }),
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        pagination: {
          encoder: (pagination) => ({
            pagination: JSON.stringify(pagination),
          }),
          decoder: (query) =>
            query["pagination"]
              ? JSON.parse(query["pagination"] as string)
              : defaultPagination,
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.pagination?.paramName === "function"
        ? options.pagination.paramName({
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          })
        : options?.pagination?.paramName ?? {
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          };

    test("basic", () => {
      const { result, rerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
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

      // set pageSize
      act(() => result.current.setPageSize(20));
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: 0,
        pageSize: 20,
      });
      expect(mockRouter.query).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: 0,
          pageSize: 20,
        }) ?? {
          [paramName.pageSize]: "20",
        },
      );

      // set pageIndex
      act(() => result.current.nextPage());
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: 1,
        pageSize: 20,
      });
      expect(mockRouter.query).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: 1,
          pageSize: 20,
        }) ?? {
          [paramName.pageIndex]: "1",
          [paramName.pageSize]: "20",
        },
      );

      // reset pageIndex
      act(() => result.current.resetPageIndex());
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: 0,
        pageSize: 20,
      });

      // reset pageSize
      act(() => result.current.resetPageSize());
      rerender();
      expect(result.current.getState().pagination).toEqual(defaultPagination);
      expect(mockRouter.query).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: 0,
          pageSize: 10,
        }) ?? {},
      );
    });
  });
});
