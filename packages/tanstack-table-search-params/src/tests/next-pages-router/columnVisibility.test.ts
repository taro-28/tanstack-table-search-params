import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type State, useTableSearchParams } from "../..";
import {
  defaultDefaultColumnVisibility,
  encodeColumnVisibility as defaultEncoder,
} from "../../encoder-decoder/columnVisibility";
import { noneStringForCustomDefaultValue } from "../../encoder-decoder/consts";
import { typedObjectEntries } from "../utils";

type ColumnVisibility = State["columnVisibility"];

const toggleColumnVisibilityState = (
  state: ColumnVisibility,
  id: string,
): ColumnVisibility =>
  Object.fromEntries(
    typedObjectEntries({
      ...state,
      [id]: state[id] === undefined ? false : !state[id],
    }),
  );

const extractFalseProperties = (state: ColumnVisibility) =>
  Object.fromEntries(
    typedObjectEntries({ ...state }).filter(([_, value]) => !value),
  );

describe("columnVisibility", () => {
  beforeEach(vi.useFakeTimers);
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
      options: { paramNames: { columnVisibility: "COLUMN_VISIBILITY" } },
    },
    {
      name: "with options: function param name",
      options: {
        paramNames: { columnVisibility: (key) => `userTable-${key}` },
      },
    },
    {
      name: "with options: default param name encoder/decoder",
      options: {
        encoders: {
          columnVisibility: (columnVisibility) => ({
            columnVisibility: JSON.stringify(columnVisibility),
          }),
        },
        decoders: {
          columnVisibility: (query) =>
            query["columnVisibility"]
              ? JSON.parse(query["columnVisibility"] as string)
              : query["columnVisibility"],
        },
      },
    },
    {
      name: "with options: custom param name encoder/decoder",
      options: {
        encoders: {
          columnVisibility: (columnVisibility) => ({
            "userTable-columnVisibility": JSON.stringify(columnVisibility),
          }),
        },
        decoders: {
          columnVisibility: (query) =>
            query["userTable-columnVisibility"]
              ? JSON.parse(query["userTable-columnVisibility"] as string)
              : query["userTable-columnVisibility"],
        },
      },
    },
    {
      name: "with options: custom number of params encoder/decoder",
      options: {
        encoders: {
          columnVisibility: (columnVisibility) =>
            Object.fromEntries(
              Object.entries(columnVisibility).map(([id, value]) => [
                `columnVisibility.${id}`,
                value ? "true" : "false",
              ]),
            ),
        },
        decoders: {
          columnVisibility: (query) =>
            Object.fromEntries(
              Object.entries(query)
                .filter(([key]) => key.startsWith("columnVisibility."))
                .map(([key, value]) => [
                  key.replace("columnVisibility.", ""),
                  value === "true",
                ]),
            ),
        },
      },
    },
    {
      name: "with options: custom default value",
      options: { defaultValues: { columnVisibility: { id: true } } },
    },
    {
      name: "with options: debounce milliseconds",
      options: { debounceMilliseconds: 1 },
    },
    {
      name: "with options: debounce milliseconds for columnVisibility",
      options: { debounceMilliseconds: { columnVisibility: 1 } },
    },
    {
      name: "with options: enabled false",
      options: { enabled: { columnVisibility: false } },
    },
    {
      name: "with options: custom param name, default value, debounce",
      options: {
        paramNames: { columnVisibility: "COLUMN_VISIBILITY" },
        defaultValues: { columnVisibility: { id: true } },
        debounceMilliseconds: 1,
      },
    },
  ])("%s", ({ options }) => {
    const paramName =
      typeof options?.paramNames?.columnVisibility === "function"
        ? options.paramNames.columnVisibility("columnVisibility")
        : options?.paramNames?.columnVisibility || "columnVisibility";

    const defaultValue: State["columnVisibility"] =
      options?.defaultValues?.columnVisibility ??
      defaultDefaultColumnVisibility;

    const debounceMilliseconds =
      options?.debounceMilliseconds !== undefined
        ? typeof options.debounceMilliseconds === "object"
          ? options.debounceMilliseconds.columnVisibility
          : options.debounceMilliseconds
        : undefined;

    const enabled = options?.enabled?.columnVisibility ?? true;

    test("basic", () => {
      const { result, rerender: resultRerender } = renderHook(() => {
        const stateAndOnChanges = useTableSearchParams(mockRouter, options);
        return useReactTable({
          columns: [{ id: "id" }, { id: "name" }],
          data: [],
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

      const encoder = options?.encoders?.columnVisibility;

      // initial state
      const wantInitialState = defaultValue;
      expect(
        extractFalseProperties(result.current.getState().columnVisibility),
      ).toEqual(extractFalseProperties(wantInitialState));
      expect(mockRouter.query).toEqual(!enabled ? {} : {});

      // toggle first column (id)
      act(() => result.current.getColumn("id")?.toggleVisibility());
      rerender();
      const wantToggledFirstColumnState = toggleColumnVisibilityState(
        wantInitialState,
        "id",
      );
      expect(
        extractFalseProperties(result.current.getState().columnVisibility),
      ).toEqual(extractFalseProperties(wantToggledFirstColumnState));
      expect(mockRouter.query).toEqual(
        !enabled
          ? {}
          : (encoder?.(wantToggledFirstColumnState) ?? {
              [paramName]: defaultEncoder(wantToggledFirstColumnState),
            }),
      );

      // toggle second column (name)
      act(() => result.current.getColumn("name")?.toggleVisibility());
      rerender();
      const wantRetoggledFirstColumnState = toggleColumnVisibilityState(
        wantToggledFirstColumnState,
        "name",
      );
      expect(
        extractFalseProperties(result.current.getState().columnVisibility),
      ).toEqual(extractFalseProperties(wantRetoggledFirstColumnState));
      expect(mockRouter.query).toEqual(
        !enabled
          ? {}
          : (encoder?.(wantRetoggledFirstColumnState) ?? {
              [paramName]: defaultEncoder(wantRetoggledFirstColumnState),
            }),
      );

      // toggle first column (id)
      act(() => result.current.getColumn("id")?.toggleVisibility());
      rerender();
      const wantToggledSecondColumnState = toggleColumnVisibilityState(
        wantRetoggledFirstColumnState,
        "id",
      );
      expect(
        extractFalseProperties(result.current.getState().columnVisibility),
      ).toEqual(extractFalseProperties(wantToggledSecondColumnState));
      expect(mockRouter.query).toEqual(
        !enabled
          ? {}
          : (encoder?.(wantToggledSecondColumnState) ?? {
              [paramName]:
                Object.keys(wantToggledSecondColumnState).length === 0
                  ? noneStringForCustomDefaultValue
                  : defaultEncoder(wantToggledSecondColumnState),
            }),
      );

      // toggle second column (name)
      act(() => result.current.getColumn("name")?.toggleVisibility());
      rerender();
      const wantRetoggledSecondColumnState = toggleColumnVisibilityState(
        wantToggledSecondColumnState,
        "name",
      );
      expect(
        extractFalseProperties(result.current.getState().columnVisibility),
      ).toEqual(extractFalseProperties(wantRetoggledSecondColumnState));
      expect(mockRouter.query).toEqual(
        !enabled ? {} : (encoder?.(wantRetoggledSecondColumnState) ?? {}),
      );
    });
  });
});
