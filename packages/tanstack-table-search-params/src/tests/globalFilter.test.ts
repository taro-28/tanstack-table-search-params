import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTableSearchParams } from "..";
import { encodedEmptyStringForCustomDefaultValue } from "../encoder-decoder/encodedEmptyStringForCustomDefaultValue";
import { defaultDefaultGlobalFilter } from "../useGlobalFilter";
import { useTestRouter } from "./testRouter";

describe("globalFilter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
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
        paramNames: {
          globalFilter: "GLOBAL_FILTER",
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        paramNames: {
          globalFilter: (key) => `userTable-${key}`,
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          globalFilter: (globalFilter) => ({
            globalFilter: JSON.stringify(globalFilter),
          }),
        },
        decoders: {
          globalFilter: (query) =>
            query["globalFilter"]
              ? JSON.parse(query["globalFilter"] as string)
              : query["globalFilter"] ?? "",
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          globalFilter: (globalFilter) => ({
            "userTable-globalFilter": JSON.stringify(globalFilter),
          }),
        },
        decoders: {
          globalFilter: (query) =>
            query["userTable-globalFilter"]
              ? JSON.parse(query["userTable-globalFilter"] as string)
              : query["userTable-globalFilter"] ?? "",
        },
      },
    },
    {
      name: "with options: custom default value",
      options: {
        defaultValues: {
          globalFilter: "default",
        },
      },
    },
    {
      name: "with options: debounce milliseconds",
      options: {
        debounceMilliseconds: {
          globalFilter: 1,
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.globalFilter === "function"
        ? options?.paramNames?.globalFilter("globalFilter")
        : options?.paramNames?.globalFilter || "globalFilter";

    test("basic", () => {
      const { result: routerResult, rerender: routerRerender } = renderHook(
        () => useTestRouter(),
      );
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(
          routerResult.current,
          options,
        );
        return useReactTable({
          columns: [],
          data: [],
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (options?.debounceMilliseconds?.globalFilter) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.globalFilter);
        }
        routerRerender();
        resultRerender();
      };

      const defaultGlobalFilter =
        options?.defaultValues?.globalFilter ?? defaultDefaultGlobalFilter;

      // initial state
      expect(result.current.getState().globalFilter).toBe(defaultGlobalFilter);
      expect(routerResult.current.query).toEqual({});

      // set
      act(() => result.current.setGlobalFilter("John"));
      rerender();
      expect(result.current.getState().globalFilter).toBe("John");
      expect(routerResult.current.query).toEqual(
        options?.encoders?.globalFilter?.("John") ?? {
          [paramName]: "John",
        },
      );

      // reset
      act(() => result.current.setGlobalFilter(""));
      rerender();

      expect(result.current.getState().globalFilter).toBe("");
      expect(routerResult.current.query).toEqual(
        options?.encoders?.globalFilter?.("") ?? {
          [paramName]: defaultGlobalFilter
            ? encodedEmptyStringForCustomDefaultValue
            : undefined,
        },
      );
    });
  });
});
