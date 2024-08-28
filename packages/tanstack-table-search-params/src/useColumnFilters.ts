import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { type Options, PARAM_NAMES, type State } from ".";
import {
  decodeColumnFilters,
  encodeColumnFilters,
} from "./encoder-decoder/columnFilters";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";

export const defaultDefaultColumnFilters =
  [] as const satisfies State["sorting"];

type Props = {
  router: Router;
  options?: Options["columnFilters"];
};

type Returns = {
  columnFilters: State["columnFilters"];
  onColumnFiltersChange: OnChangeFn<State["columnFilters"]>;
};

export const useColumnFilters = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.COLUMN_FILTERS)
      : options?.paramName) || PARAM_NAMES.COLUMN_FILTERS;

  const defaultColumnFilters =
    options?.defaultValue ?? defaultDefaultColumnFilters;

  const uncustomisedColumnFilters = useMemo(
    () => decodeColumnFilters(router.query[paramName], defaultColumnFilters),
    [router.query[paramName], paramName, defaultColumnFilters],
  );

  // If `router.query` is included in the dependency array,
  // `columnFilters` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomColumnFilters = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const columnFilters = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomColumnFilters === ""
          ? []
          : JSON.parse(stringCustomColumnFilters)
        : uncustomisedColumnFilters,
    [stringCustomColumnFilters, uncustomisedColumnFilters, isCustomDecoder],
  );

  return {
    columnFilters,
    onColumnFiltersChange: useCallback(
      async (updater) => {
        const newColumnFilters = functionalUpdate(updater, columnFilters);
        const encoder = (columnFilters: State["columnFilters"]) =>
          options?.encoder
            ? options.encoder(columnFilters)
            : {
                [paramName]: encodeColumnFilters(
                  columnFilters,
                  defaultColumnFilters,
                ),
              };
        await updateQuery({
          oldQuery: encoder(columnFilters),
          newQuery: encoder(newColumnFilters),
          router,
        });
      },
      [
        router,
        columnFilters,
        paramName,
        options?.encoder,
        defaultColumnFilters,
      ],
    ),
  };
};
