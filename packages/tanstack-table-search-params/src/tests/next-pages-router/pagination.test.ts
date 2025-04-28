import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTableSearchParams } from "../..";
import { defaultDefaultPagination } from "../../encoder-decoder/pagination";
import { testData, testDataColumns } from "../testData";

describe("pagination", () => {
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
          pagination: (pagination) => ({
            pageIndex: JSON.stringify(pagination.pageIndex),
            pageSize: JSON.stringify(pagination.pageSize),
          }),
        },
        decoders: {
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
          pagination: (pagination) => ({
            "userTable-pageIndex": JSON.stringify(pagination.pageIndex),
            "userTable-pageSize": JSON.stringify(pagination.pageSize),
          }),
        },
        decoders: {
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
          pagination: (pagination) => ({
            pagination: JSON.stringify(pagination),
          }),
        },
        decoders: {
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
          pagination: {
            pageIndex: 3,
            pageSize: 25,
          },
        },
      },
    },
    {
      name: "with options: debounce milliseconds",
      options: {
        debounceMilliseconds: 1,
      },
    },
    {
      name: "with options: debounce milliseconds for pagination",
      options: {
        debounceMilliseconds: {
          pagination: 1,
        },
      },
    },
    {
      name: "with options: custom param name, default value, debounce",
      options: {
        paramNames: {
          pagination: {
            pageIndex: "PAGE_INDEX",
            pageSize: "PAGE_SIZE",
          },
        },
        defaultValues: {
          pagination: {
            pageIndex: 3,
            pageSize: 25,
          },
        },
        debounceMilliseconds: 1,
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.pagination === "function"
        ? options.paramNames.pagination({
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          })
        : (options?.paramNames?.pagination ?? {
            pageIndex: "pageIndex",
            pageSize: "pageSize",
          });

    const debounceMilliseconds =
      options?.debounceMilliseconds !== undefined
        ? typeof options.debounceMilliseconds === "object"
          ? options.debounceMilliseconds.pagination
          : options.debounceMilliseconds
        : undefined;

    test("basic", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: testDataColumns,
          data: testData,
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (debounceMilliseconds !== undefined) {
          vi.advanceTimersByTime(debounceMilliseconds);
        }
        resultRerender();
      };

      const defaultPagination =
        options?.defaultValues?.pagination ?? defaultDefaultPagination;

      // initial state
      expect(result.current.getState().pagination).toEqual(defaultPagination);
      expect(mockRouter.query).toEqual({});

      const updatedPageSize = 20;

      // set pageSize
      act(() => result.current.setPageSize(updatedPageSize));
      rerender();
      expect(result.current.getState().pagination).toEqual({
        pageIndex: defaultPagination.pageIndex,
        pageSize: updatedPageSize,
      });
      expect(mockRouter.query).toEqual(
        options?.encoders?.pagination?.({
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
      expect(mockRouter.query).toEqual(
        options?.encoders?.pagination?.({
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
      expect(mockRouter.query).toEqual(
        options?.encoders?.pagination?.({
          pageIndex: 0,
          pageSize: updatedPageSize,
        }) ?? {
          [paramName.pageIndex]: options?.defaultValues?.pagination
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
      expect(mockRouter.query).toEqual(
        options?.encoders?.pagination?.({
          pageIndex: 0,
          pageSize: 10,
        }) ??
          (options?.defaultValues?.pagination
            ? {
                [paramName.pageIndex]: "1",
                [paramName.pageSize]: "10",
              }
            : {}),
      );
    });
  });
});
