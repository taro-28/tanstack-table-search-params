import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeColumnFilters,
  encodeColumnFilters,
} from "./encoder-decoder/columnFilters";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"columnFilters">;
};

type Returns = {
  columnFilters: State["columnFilters"];
  columnFiltersEncoder: (columnFilters: State["columnFilters"]) => Query;
  onColumnFiltersChange: OnChangeFn<State["columnFilters"]>;
};

export const useColumnFilters = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.COLUMN_FILTERS)
      : options?.paramName) || PARAM_NAMES.COLUMN_FILTERS;

  const stringDefaultColumnFilters =
    options?.defaultValue && JSON.stringify(options?.defaultValue);

  const uncustomisedColumnFilters = useMemo(
    () =>
      decodeColumnFilters(router.query[paramName], {
        defaultValue:
          stringDefaultColumnFilters === undefined
            ? undefined
            : JSON.parse(stringDefaultColumnFilters),
      }),
    [router.query[paramName], paramName, stringDefaultColumnFilters],
  );

  // If `router.query` is included in the dependency array,
  // `columnFilters` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomColumnFilters = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _columnFilters = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomColumnFilters === ""
          ? []
          : JSON.parse(stringCustomColumnFilters)
        : uncustomisedColumnFilters,
    [stringCustomColumnFilters, uncustomisedColumnFilters, isCustomDecoder],
  );

  const columnFiltersEncoder = useCallback(
    (columnFilters: State["columnFilters"]) =>
      options?.encoder
        ? options.encoder(columnFilters)
        : {
            [paramName]: encodeColumnFilters(columnFilters, {
              defaultValue:
                stringDefaultColumnFilters === undefined
                  ? undefined
                  : JSON.parse(stringDefaultColumnFilters),
            }),
          },
    [paramName, options?.encoder, stringDefaultColumnFilters],
  );

  const updateColumnFiltersQuery = useCallback(
    (newColumnFilters: State["columnFilters"]) =>
      updateQuery({
        oldQuery: columnFiltersEncoder(_columnFilters),
        newQuery: columnFiltersEncoder(newColumnFilters),
        router,
      }),
    [router, columnFiltersEncoder, _columnFilters],
  );

  const [debouncedColumnFilters, setDebouncedColumnFilters] = useDebounce({
    stateValue: _columnFilters,
    updateQuery: updateColumnFiltersQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const columnFilters = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _columnFilters
        : debouncedColumnFilters,
    [_columnFilters, debouncedColumnFilters, options?.debounceMilliseconds],
  );

  return {
    columnFilters,
    columnFiltersEncoder,
    onColumnFiltersChange: useCallback(
      async (updater) => {
        const newColumnFilters = functionalUpdate(updater, columnFilters);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedColumnFilters(newColumnFilters);
          return;
        }
        await updateColumnFiltersQuery(newColumnFilters);
      },
      [
        columnFilters,
        updateColumnFiltersQuery,
        options?.debounceMilliseconds,
        setDebouncedColumnFilters,
      ],
    ),
  };
};
