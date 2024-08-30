import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTableSearchParams } from "..";
import { encodedEmptyStringForCustomDefaultValue } from "../encoder-decoder/encodedEmptyStringForCustomDefaultValue";
import { defaultDefaultSorting } from "../useSorting";
import { useTestRouter } from "./testRouter";

describe("sorting", () => {
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
          sorting: "SORTING",
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        paramNames: {
          sorting: (key) => `userTable-${key}`,
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          sorting: (sorting) => ({
            sorting: JSON.stringify(sorting),
          }),
        },
        decoders: {
          sorting: (query) =>
            query["sorting"]
              ? JSON.parse(query["sorting"] as string)
              : query["sorting"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          sorting: (sorting) => ({
            "userTable-sorting": JSON.stringify(sorting),
          }),
        },
        decoders: {
          sorting: (query) =>
            query["userTable-sorting"]
              ? JSON.parse(query["userTable-sorting"] as string)
              : query["userTable-sorting"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          sorting: (sorting) =>
            Object.fromEntries(
              sorting.map(({ id, desc }) => [
                `sorting.${id}`,
                desc ? "desc" : "asc",
              ]),
            ),
        },
        decoders: {
          sorting: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("sorting."))
              .map(([key, desc]) => ({
                id: key.replace("sorting.", ""),
                desc: desc === "desc",
              })),
        },
      },
    },
    {
      name: "with options: custom default value",
      options: {
        defaultValues: {
          sorting: [{ id: "custom", desc: true }],
        },
      },
    },
    {
      name: "with options: debounce milliseconds",
      options: {
        debounceMilliseconds: {
          sorting: 1,
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.sorting === "function"
        ? options.paramNames.sorting("sorting")
        : options?.paramNames?.sorting || "sorting";

    const defaultSorting =
      options?.defaultValues?.sorting ?? defaultDefaultSorting;

    test("single column", () => {
      const { result: routerResult, rerender: routerRerender } = renderHook(
        () => useTestRouter(),
      );
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(
          routerResult.current,
          options,
        );
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
      const rerender = () => {
        if (options?.debounceMilliseconds?.sorting) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.sorting);
        }
        routerRerender();
        resultRerender();
      };

      // initial state
      expect(result.current.getState().sorting).toEqual(defaultSorting);
      expect(routerResult.current.query).toEqual({});

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([{ id: "id", desc: true }]) ?? {
          [paramName]: "id.desc",
        },
      );

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([{ id: "id", desc: false }]) ?? {
          [paramName]: "id.asc",
        },
      );

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([{ id: "name", desc: false }]) ?? {
          [paramName]: "name.asc",
        },
      );

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([]) ?? {
          [paramName]:
            defaultSorting.length > 0
              ? encodedEmptyStringForCustomDefaultValue
              : undefined,
        },
      );
    });

    test("multiple columns", () => {
      const { result: routerResult, rerender: routerRerender } = renderHook(
        () => useTestRouter(),
      );
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(
          routerResult.current,
          options,
        );
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
      const rerender = () => {
        if (options?.debounceMilliseconds?.sorting) {
          vi.advanceTimersByTime(options?.debounceMilliseconds?.sorting);
        }
        routerRerender();
        resultRerender();
      };

      // initial state
      expect(result.current.getState().sorting).toEqual(defaultSorting);
      expect(routerResult.current.query).toEqual({});

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([
          { id: "id", desc: true },
          { id: "name", desc: false },
        ]) ?? { [paramName]: "id.desc,name.asc" },
      );

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([
          { id: "id", desc: false },
          { id: "name", desc: false },
        ]) ?? { [paramName]: "id.asc,name.asc" },
      );

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
      expect(routerResult.current.query).toEqual(
        options?.encoders?.sorting?.([{ id: "id", desc: false }]) ?? {
          [paramName]: "id.asc",
        },
      );
    });
  });
});
