import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeGlobalFilter,
  encodeGlobalFilter,
} from "./encoder-decoder/globalFilter";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"globalFilter"> | undefined;
};

type Returns = {
  globalFilter: State["globalFilter"];
  onGlobalFilterChange: OnChangeFn<State["globalFilter"]>;
  globalFilterEncoder: (globalFilter: State["globalFilter"]) => Query;
};

export const useGlobalFilter = ({ router, options }: Props): Returns => {
  const paramNames =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.GLOBAL_FILTER)
      : options?.paramName) || PARAM_NAMES.GLOBAL_FILTER;

  const _globalFilter = options?.decoder
    ? options?.decoder?.(router.query)
    : decodeGlobalFilter(router.query[paramNames], {
        defaultValue: options?.defaultValue,
      });

  const globalFilterEncoder = useCallback(
    (globalFilter: State["globalFilter"]) =>
      options?.encoder
        ? options.encoder(globalFilter)
        : {
            [paramNames]: encodeGlobalFilter(globalFilter, {
              defaultValue: options?.defaultValue,
            }),
          },
    [options?.encoder, options?.defaultValue, paramNames],
  );

  const updateGlobalFilterQuery = useCallback(
    (newGlobalFilter: State["globalFilter"]) =>
      updateQuery({
        oldQuery: globalFilterEncoder(_globalFilter),
        newQuery: globalFilterEncoder(newGlobalFilter),
        router,
      }),
    [router, globalFilterEncoder, _globalFilter],
  );

  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useDebounce({
    stateValue: _globalFilter,
    updateQuery: updateGlobalFilterQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const globalFilter = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _globalFilter
        : debouncedGlobalFilter,
    [_globalFilter, debouncedGlobalFilter, options?.debounceMilliseconds],
  );

  return {
    globalFilter,
    onGlobalFilterChange: useCallback(
      async (updater) => {
        const newGlobalFilter = functionalUpdate(updater, globalFilter);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedGlobalFilter(newGlobalFilter);
          return;
        }
        await updateGlobalFilterQuery(newGlobalFilter);
      },
      [
        globalFilter,
        options?.debounceMilliseconds,
        updateGlobalFilterQuery,
        setDebouncedGlobalFilter,
      ],
    ),
    globalFilterEncoder,
  };
};
