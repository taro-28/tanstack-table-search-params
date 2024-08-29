import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeGlobalFilter,
  encodeGlobalFilter,
} from "./encoder-decoder/globalFilter";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";
import type { ExtractSpecificStateOptions } from "./utils";

export const defaultDefaultGlobalFilter =
  "" as const satisfies State["globalFilter"];

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

  const defaultGlobalFilter =
    options?.defaultValue ?? defaultDefaultGlobalFilter;

  const globalFilter = options?.decoder
    ? options?.decoder?.(router.query)
    : decodeGlobalFilter(router.query[paramNames], defaultGlobalFilter);

  return {
    globalFilter,
    onGlobalFilterChange: useCallback(
      async (updater) => {
        const newGlobalFilter = functionalUpdate(updater, globalFilter);
        const encoder = (globalFilter: State["globalFilter"]) =>
          options?.encoder
            ? options.encoder(globalFilter)
            : {
                [paramNames]: encodeGlobalFilter(
                  globalFilter,
                  defaultGlobalFilter,
                ),
              };
        await updateQuery({
          oldQuery: encoder(globalFilter),
          newQuery: encoder(newGlobalFilter),
          router,
        });
      },
      [router, globalFilter, paramNames, options?.encoder, defaultGlobalFilter],
    ),
  };
};
