import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { type Options, PARAM_NAMES, type State } from ".";
import {
  decodeColumnFilters,
  encodeColumnFilters,
} from "./encoder-decoder/columnFilters";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";

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

  const defaultColumnFilters = useMemo(
    () => decodeColumnFilters(router.query[paramName]),
    [router.query[paramName], paramName],
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
        : defaultColumnFilters,
    [stringCustomColumnFilters, defaultColumnFilters, isCustomDecoder],
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
                [paramName]: encodeColumnFilters(columnFilters),
              };
        await updateQuery({
          oldQuery: encoder(columnFilters),
          newQuery: encoder(newColumnFilters),
          router,
        });
      },
      [router, columnFilters, paramName, options?.encoder],
    ),
  };
};
