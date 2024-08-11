import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, describe, expect, test } from "vitest";
import { useTableSearchParams } from "../..";

describe("sorting", () => {
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
        sorting: {
          paramName: "SORTING",
        },
      },
    },
    {
      name: "with options: function param name",
      options: {
        sorting: {
          paramName: (key) => `userTable-${key}`,
        },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        sorting: {
          encoder: (sorting) => ({
            sorting: JSON.stringify(sorting),
          }),
          decoder: (query) =>
            query["sorting"]
              ? JSON.parse(query["sorting"] as string)
              : query["sorting"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        sorting: {
          encoder: (sorting) => ({
            "userTable-sorting": JSON.stringify(sorting),
          }),
          decoder: (query) =>
            query["userTable-sorting"]
              ? JSON.parse(query["userTable-sorting"] as string)
              : query["userTable-sorting"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        sorting: {
          encoder: (sorting) =>
            Object.fromEntries(
              sorting.map(({ id, desc }) => [
                `sorting.${id}`,
                desc ? "desc" : "asc",
              ]),
            ),
          decoder: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("sorting."))
              .map(([key, desc]) => ({
                id: key.replace("sorting.", ""),
                desc: desc === "desc",
              })),
        },
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.sorting?.paramName === "function"
        ? options.sorting.paramName("sorting")
        : options?.sorting?.paramName || "sorting";

    test("single column", () => {
      const { result, rerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([{ id: "id", desc: true }]) ?? {
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([{ id: "id", desc: false }]) ?? {
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([{ id: "name", desc: false }]) ?? {
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
      expect(mockRouter.query).toEqual(options?.sorting?.encoder?.([]) ?? {});
    });

    test("multiple columns", () => {
      const { result, rerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([
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
      expect(mockRouter.query).toEqual(
        options?.sorting?.encoder?.([{ id: "id", desc: false }]) ?? {
          [paramName]: "id.asc",
        },
      );
    });
  });
});
