import type { RowData, TableOptions, TableState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { typedObjectEntries, typedObjectKeys } from "../../../utils/object";
import { decoders } from "./decode";
import { encoders } from "./encode";
import { onChangeGenerator } from "./onChangeGenerator";
import type { Query } from "./types";

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

type Props = {
  [key in keyof State]?: {
    encoder: (value: State[key]) => string | undefined;
    decoder: (value: Query[string]) => State[key];
  };
};

type Returns<TData extends RowData> = {
  state: State;
} & OnChanges<TData>;

export const useTableSearchParams = <T extends RowData>(
  props?: Props,
): Returns<T> => {
  const router = useRouter();

  const state = useMemo(() => {
    const entries = typedObjectKeys(decoders).map((key) => {
      const decoder = props?.[key]?.decoder ?? decoders[key];
      return [key, decoder(router.query[key])];
    });
    return Object.fromEntries(entries);
  }, [router.query, props]);

  const onChanges = useMemo(() => {
    const entries = typedObjectEntries(onChangeNames).map(([key, value]) => {
      const encoder = props?.[key]?.encoder ?? encoders[key];
      return [value, onChangeGenerator(key, { router, state, encoder })];
    });
    return Object.fromEntries(entries);
  }, [router, state, props]);

  return { state, ...onChanges };
};
