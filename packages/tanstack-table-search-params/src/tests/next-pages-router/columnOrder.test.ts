import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTableSearchParams } from "../..";
import { defaultDefaultColumnOrder } from "../../encoder-decoder/columnOrder";
import { noneStringForCustomDefaultValue } from "../../encoder-decoder/noneStringForCustomDefaultValue";

describe("columnOrder", () => {
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
    { name: "no options" },
    {
      name: "with options: string param name",
      options: { paramNames: { columnOrder: "COLUMN_FILTERS" } },
    },
    {
      name: "with options: function param name",
      options: { paramNames: { columnOrder: (key) => `userTable-${key}` } },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          columnOrder: (columnOrder) => ({
            columnOrder: JSON.stringify(columnOrder),
          }),
        },
        decoders: {
          columnOrder: (query) =>
            query["columnOrder"]
              ? JSON.parse(query["columnOrder"] as string)
              : query["columnOrder"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          columnOrder: (columnOrder) => ({
            "userTable-columnOrder": JSON.stringify(columnOrder),
          }),
        },
        decoders: {
          columnOrder: (query) =>
            query["userTable-columnOrder"]
              ? JSON.parse(query["userTable-columnOrder"] as string)
              : query["userTable-columnOrder"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          columnOrder: (columnOrder) =>
            Object.fromEntries(
              columnOrder.map((value, i) => [
                `columnOrder.${i}`,
                JSON.stringify(value),
              ]),
            ),
        },
        decoders: {
          columnOrder: (query) =>
            Object.entries(query)
              .filter(([key]) => key.startsWith("columnOrder."))
              .map(([_, value]) => JSON.parse(value as string)),
        },
      },
    },
    {
      name: "with options: custom default value",
      options: { defaultValues: { columnOrder: ["name", "id"] } },
    },
    {
      name: "with options: debounce milliseconds",
      options: { debounceMilliseconds: 1 },
    },
    {
      name: "with options: debounce milliseconds for columnOrder",
      options: { debounceMilliseconds: { columnOrder: 1 } },
    },
    {
      name: "with options: enabled false",
      options: { enabled: { columnOrder: false } },
    },
    {
      name: "with options: custom param name, default value, debounce",
      options: {
        paramNames: { columnOrder: "COLUMN_FILTERS" },
        defaultValues: { columnOrder: ["name", "id"] },
        debounceMilliseconds: 1,
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.columnOrder === "function"
        ? options?.paramNames?.columnOrder("columnOrder")
        : options?.paramNames?.columnOrder || "columnOrder";

    const defaultColumnOrder =
      options?.defaultValues?.columnOrder ?? defaultDefaultColumnOrder;

    const debounceMilliseconds =
      options?.debounceMilliseconds !== undefined
        ? typeof options.debounceMilliseconds === "object"
          ? options.debounceMilliseconds.columnOrder
          : options.debounceMilliseconds
        : undefined;

    const enabled = options?.enabled?.columnOrder ?? true;

    test("single column: string value", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
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
      const rerender = () => {
        if (debounceMilliseconds !== undefined) {
          vi.advanceTimersByTime(debounceMilliseconds);
        }
        resultRerender();
      };

      // initial state
      expect(result.current.getState().columnOrder).toEqual(defaultColumnOrder);
      expect(mockRouter.query).toEqual(!enabled ? {} : {});

      const reversed = result.current
        .getAllLeafColumns()
        .reverse()
        .map((c) => c.id);
      // set column order
      act(() => {
        result.current.setColumnOrder(reversed);
      });
      rerender();

      expect(result.current.getState().columnOrder).toEqual(reversed);
      expect(mockRouter.query).toEqual(
        !enabled
          ? {}
          : (options?.encoders?.columnOrder?.(reversed) ?? {
              [paramName]:
                defaultColumnOrder.length === 0 ? "name,id" : "id,name",
            }),
      );

      // reset
      act(() => {
        result.current.setColumnOrder([]);
      });
      rerender();

      expect(mockRouter.query).toEqual(
        !enabled
          ? {}
          : (options?.encoders?.columnOrder?.(defaultColumnOrder) ?? {
              [paramName]:
                defaultColumnOrder.length > 0
                  ? noneStringForCustomDefaultValue
                  : undefined,
            }),
      );
      expect(result.current.getState().columnOrder).toEqual([]);
    });
  });
});
