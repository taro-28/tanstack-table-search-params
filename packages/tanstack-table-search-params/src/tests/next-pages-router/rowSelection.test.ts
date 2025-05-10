import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type State, useTableSearchParams } from "../..";
import { noneStringForCustomDefaultValue } from "../../encoder-decoder/noneStringForCustomDefaultValue";
import {
  defaultDefaultRowSelection,
  encodeRowSelection as defaultEncoder,
} from "../../encoder-decoder/rowSelection";

const typedObjectEntries = <K extends string | number | symbol, V>(
  object: Record<K, V>,
): [K, V][] => Object.entries(object) as [K, V][];

type RowSelection = State["rowSelection"];

const toggleRowState = (state: RowSelection, id: number): RowSelection =>
  Object.fromEntries(
    typedObjectEntries({ ...state, [id]: !state[id] }).filter(
      ([_, value]) => value,
    ),
  );

describe("rowSelection", () => {
  beforeEach(() => vi.useFakeTimers());
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
      options: { paramNames: { rowSelection: "ROW_SELECTION" } },
    },
    {
      name: "with options: function param name",
      options: { paramNames: { rowSelection: (key) => `userTable-${key}` } },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          rowSelection: (rowSelection) => ({
            rowSelection: JSON.stringify(rowSelection),
          }),
        },
        decoders: {
          rowSelection: (query) =>
            query["rowSelection"]
              ? JSON.parse(query["rowSelection"] as string)
              : query["rowSelection"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          rowSelection: (rowSelection) => ({
            "userTable-rowSelection": JSON.stringify(rowSelection),
          }),
        },
        decoders: {
          rowSelection: (query) =>
            query["userTable-rowSelection"]
              ? JSON.parse(query["userTable-rowSelection"] as string)
              : query["userTable-rowSelection"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          rowSelection: (rowSelection) =>
            Object.fromEntries(
              Object.keys(rowSelection).map((id) => [
                `rowSelection.${id}`,
                "true",
              ]),
            ),
        },
        decoders: {
          rowSelection: (query) =>
            Object.fromEntries(
              Object.entries(query)
                .filter(([key]) => key.startsWith("rowSelection."))
                .map(([key]) => [key.replace("rowSelection.", ""), true]),
            ),
        },
      },
    },
    {
      name: "with options: custom default value",
      options: { defaultValues: { rowSelection: { "1": true } } },
    },
    {
      name: "with options: debounce milliseconds",
      options: { debounceMilliseconds: 1 },
    },
    {
      name: "with options: debounce milliseconds for rowSelection",
      options: { debounceMilliseconds: { rowSelection: 1 } },
    },
    {
      name: "with options: custom param name, default value, debounce",
      options: {
        paramNames: { rowSelection: "ROW_SELECTION" },
        defaultValues: { rowSelection: { "1": true } },
        debounceMilliseconds: 1,
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.rowSelection === "function"
        ? options.paramNames.rowSelection("rowSelection")
        : options?.paramNames?.rowSelection || "rowSelection";

    const defaultRowSelection: State["rowSelection"] =
      options?.defaultValues?.rowSelection ?? defaultDefaultRowSelection;

    const debounceMilliseconds =
      options?.debounceMilliseconds !== undefined
        ? typeof options.debounceMilliseconds === "object"
          ? options.debounceMilliseconds.rowSelection
          : options.debounceMilliseconds
        : undefined;

    test("basic", () => {
      const firstRow = { id: 0, name: "John" };
      const secondRow = { id: 1, name: "Jane" };
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: [{ accessorKey: "id" }, { accessorKey: "name" }],
          data: [firstRow, secondRow],
          getCoreRowModel: getCoreRowModel(),
          ...stateAndOnChanges,
        });
      });
      const rerender = () => {
        if (debounceMilliseconds) {
          vi.advanceTimersByTime(debounceMilliseconds);
        }
        resultRerender();
      };

      const encoder = options?.encoders?.rowSelection;

      // initial state
      const wantInitialState = defaultRowSelection;
      expect(result.current.getState().rowSelection).toEqual(wantInitialState);
      expect(mockRouter.query).toEqual({});

      // toggle first row
      act(() => result.current.getCenterRows()[0]?.toggleSelected());
      rerender();
      const wantToggledFirstRowState = toggleRowState(
        wantInitialState,
        firstRow!.id,
      );
      expect(result.current.getState().rowSelection).toEqual(
        wantToggledFirstRowState,
      );
      expect(mockRouter.query).toEqual(
        encoder?.(wantToggledFirstRowState) ?? {
          [paramName]: defaultEncoder(wantToggledFirstRowState),
        },
      );

      // toggle second row
      act(() => result.current.getCenterRows()[1]?.toggleSelected());
      rerender();
      const wantToggledSecondRowState = toggleRowState(
        wantToggledFirstRowState,
        secondRow!.id,
      );
      expect(result.current.getState().rowSelection).toEqual(
        wantToggledSecondRowState,
      );
      expect(mockRouter.query).toEqual(
        encoder?.(wantToggledSecondRowState) ?? {
          [paramName]: defaultEncoder(wantToggledSecondRowState),
        },
      );

      // retoggle first row
      act(() => result.current.getCenterRows()[0]?.toggleSelected());
      rerender();
      const wantRetoggledFirstRowState = toggleRowState(
        wantToggledSecondRowState,
        firstRow!.id,
      );
      expect(result.current.getState().rowSelection).toEqual(
        wantRetoggledFirstRowState,
      );
      expect(mockRouter.query).toEqual(
        encoder?.(wantRetoggledFirstRowState) ?? {
          [paramName]:
            Object.keys(wantRetoggledFirstRowState).length === 0
              ? noneStringForCustomDefaultValue
              : defaultEncoder(wantRetoggledFirstRowState),
        },
      );

      // retoggle second row
      act(() => result.current.getCenterRows()[1]?.toggleSelected());
      rerender();
      const wantRetoggledSecondRowState = toggleRowState(
        wantRetoggledFirstRowState,
        secondRow!.id,
      );
      expect(result.current.getState().rowSelection).toEqual(
        wantRetoggledSecondRowState,
      );
      expect(mockRouter.query).toEqual(
        encoder?.(wantRetoggledSecondRowState) ?? {},
      );
    });
  });
});
