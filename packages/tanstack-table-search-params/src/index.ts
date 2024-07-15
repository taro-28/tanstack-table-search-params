import {
  typedObjectEntries,
  typedObjectKeys,
} from "@tanstack-table-search-params/utils/object";
import type { RowData, TableOptions, TableState } from "@tanstack/react-table";
import { useMemo } from "react";
import { decoders } from "./encoder-decoder/decoders";
import { encoders } from "./encoder-decoder/encoders";
import { onChangeGenerator } from "./onChangeGenerator";
import type { Query, Router } from "./types";

export type State = Pick<TableState, "globalFilter" | "sorting">;

export type OnChanges<TData extends RowData = unknown> = Pick<
  TableOptions<TData>,
  "onGlobalFilterChange" | "onSortingChange"
>;

export const paramNames = {
  globalFilter: "globalFilter",
  sorting: "sorting",
} as const satisfies Record<keyof State, keyof State>;

const onChangeNames = {
  globalFilter: "onGlobalFilterChange",
  sorting: "onSortingChange",
} as const satisfies Record<keyof State, keyof OnChanges>;

type Options = {
  [key in keyof State]?: {
    encoder: (value: State[key]) => string | undefined;
    decoder: (value: Query[string]) => State[key];
  };
};

type Returns<TData extends RowData> = {
  state: State;
} & OnChanges<TData>;

export const useTableSearchParams = <T extends RowData>(
  router: Router,
  options?: Options,
): Returns<T> => {
  const state = useMemo(() => {
    const entries = typedObjectKeys(decoders).map((key) => {
      const decoder = options?.[key]?.decoder ?? decoders[key];
      return [key, decoder(router.query[key])];
    });
    return Object.fromEntries(entries);
  }, [router.query, options]);

  const onChanges = useMemo(() => {
    const entries = typedObjectEntries(onChangeNames).map(([key, value]) => {
      const encoder = options?.[key]?.encoder ?? encoders[key];
      return [value, onChangeGenerator(key, { router, state, encoder })];
    });
    return Object.fromEntries(entries);
  }, [router, state, options]);

  return { state, ...onChanges };
};
