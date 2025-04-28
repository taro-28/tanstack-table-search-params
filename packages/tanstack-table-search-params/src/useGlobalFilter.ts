import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeGlobalFilter,
  encodeGlobalFilter,
} from "./encoder-decoder/globalFilter";
import type { Router } from "./types";
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
};

export const useGlobalFilter = ({ router, options }: Props): Returns => {
  const paramNames =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.GLOBAL_FILTER)
      : options?.paramName) || PARAM_NAMES.GLOBAL_FILTER;

  const defaultGlobalFilter = options?.defaultValue;

  const _globalFilter = options?.decoder
    ? options?.decoder?.(router.query)
    : decodeGlobalFilter(router.query[paramNames], {
        defaultValue: defaultGlobalFilter,
      });

  const updateGlobalFilterQuery = useCallback(
    async (newGlobalFilter: State["globalFilter"]) => {
      const encoder = (globalFilter: State["globalFilter"]) =>
        options?.encoder
          ? options.encoder(globalFilter)
          : {
              [paramNames]: encodeGlobalFilter(globalFilter, {
                defaultValue: defaultGlobalFilter,
              }),
            };
      await updateQuery({
        oldQuery: encoder(_globalFilter),
        newQuery: encoder(newGlobalFilter),
        router,
      });
    },
    [router, paramNames, options?.encoder, defaultGlobalFilter, _globalFilter],
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
  };
};
