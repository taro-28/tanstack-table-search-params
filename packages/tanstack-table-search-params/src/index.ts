import {
  typedObjectEntries,
  typedObjectKeys,
} from "@tanstack-table-search-params/utils/object";
import type { RowData, TableOptions, TableState } from "@tanstack/react-table";
import { useMemo } from "react";
import { decoders, type Decoder } from "./encoder-decoder/decoders";
import { encoders, type Encoder } from "./encoder-decoder/encoders";
import { onChangeGenerator } from "./onChangeGenerator";
import type { Router } from "./types";

export type State = Pick<TableState, "globalFilter" | "sorting">;

export type OnChanges<T_DATA extends RowData = unknown> = Pick<
  TableOptions<T_DATA>,
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
  [KEY in keyof State]?: {
    encoder: Encoder<KEY>;
    decoder: Decoder<KEY>;
  };
};

type Returns<T_DATA extends RowData> = {
  state: State;
} & OnChanges<T_DATA>;

export const useTableSearchParams = <T_DATA extends RowData>(
  router: Router,
  options?: Options,
): Returns<T_DATA> => {
  const state = useMemo(() => {
    const entries = typedObjectKeys(decoders).map((key) => {
      const decoder = options?.[key]?.decoder ?? decoders[key];
      return [key, decoder({ query: router.query, paramName: key })];
    });
    return Object.fromEntries(entries);
  }, [router.query, options]);

  const onChanges = useMemo(() => {
    const entries = typedObjectEntries(onChangeNames).map(([key, value]) => {
      const encoder = options?.[key]?.encoder ?? encoders[key];
      return [
        value,
        onChangeGenerator({
          paramName: key,
          router,
          stateValue: state[key],
          encoder,
        }),
      ];
    });
    return Object.fromEntries(entries);
  }, [router, state, options]);

  return { state, ...onChanges };
};
