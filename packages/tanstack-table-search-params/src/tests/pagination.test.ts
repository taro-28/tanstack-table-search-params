import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { useTableSearchParams } from "..";
import { defaultDefaultPagination } from "../usePagination";
import { getQuery } from "./getQuery";
import { testData, testDataColumns } from "./testData";
import { testRouter } from "./testRouter";

describe("pagination", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
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
        pagination: {
          encoder: (pagination) => ({
            "userTable-pageIndex": JSON.stringify(pagination.pageIndex),
            "userTable-pageSize": JSON.stringify(pagination.pageSize),
          }),
          decoder: (query) => ({
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
        pagination: {
          encoder: (pagination) => ({
            pagination: JSON.stringify(pagination),
          }),
          decoder: (query) =>
            query["pagination"]
              ? JSON.parse(query["pagination"] as string)
              : defaultDefaultPagination,
        },
      },
    },
    {
      name: "with options: custom default value",
      options: {
        pagination: {
          defaultValue: {
            pageIndex: 3,
            pageSize: 25,
          },
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
        const stateAndOnChanges = useTableSearchParams(testRouter, options);
        return useReactTable({
          columns: testDataColumns,
          data: testData,
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });

      const defaultPagination =
        options?.pagination?.defaultValue ?? defaultDefaultPagination;

      // initial state
      expect(result.current.getState().pagination).toEqual(defaultPagination);
      expect(getQuery()).toEqual({});

      const updatedPageSize = 20;

      // set pageSize
      act(() => result.current.setPageSize(updatedPageSize));
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: defaultPagination.pageIndex,
        pageSize: updatedPageSize,
      });
      expect(getQuery()).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: defaultPagination.pageIndex,
          pageSize: updatedPageSize,
        }) ?? {
          [paramName.pageSize]: `${updatedPageSize}`,
        },
      );

      // set pageIndex
      act(() => result.current.nextPage());
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: defaultPagination.pageIndex + 1,
        pageSize: updatedPageSize,
      });
      expect(getQuery()).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: defaultPagination.pageIndex + 1,
          pageSize: updatedPageSize,
        }) ?? {
          [paramName.pageIndex]: `${defaultPagination.pageIndex + 2}`,
          [paramName.pageSize]: `${updatedPageSize}`,
        },
      );

      // reset pageIndex
      act(() => result.current.resetPageIndex());
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: 0,
        pageSize: updatedPageSize,
      });
      expect(getQuery()).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: 0,
          pageSize: updatedPageSize,
        }) ?? {
          [paramName.pageIndex]: options?.pagination?.defaultValue
            ? "1"
            : undefined,
          [paramName.pageSize]: `${updatedPageSize}`,
        },
      );

      // reset pageSize
      act(() => result.current.resetPageSize());
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: 0,
        pageSize: 10,
      });
      expect(getQuery()).toEqual(
        options?.pagination?.encoder?.({
          pageIndex: 0,
          pageSize: 10,
        }) ??
          (options?.pagination?.defaultValue
            ? {
                [paramName.pageIndex]: "1",
                [paramName.pageSize]: "10",
              }
            : {}),
      );
    });
  });
});
