import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { type Options, PARAM_NAMES, type State } from ".";
import { decodeSorting, encodeSorting } from "./encoder-decoder/sorting";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";

export const defaultDefaultSorting = [] as const satisfies State["sorting"];

type Props = {
  router: Router;
  options?: Options["sorting"];
};

type Returns = {
  sorting: State["sorting"];
  onSortingChange: OnChangeFn<State["sorting"]>;
};

export const useSorting = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.SORTING)
      : options?.paramName) || PARAM_NAMES.SORTING;

  const defaultSorting = options?.defaultValue ?? defaultDefaultSorting;

  const uncustomisedSorting = useMemo(
    () => decodeSorting(router.query[paramName], defaultSorting),
    [router.query[paramName], paramName, defaultSorting],
  );

  // If `router.query` is included in the dependency array,
  // `sorting` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomSorting = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const sorting = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomSorting === ""
          ? []
          : JSON.parse(stringCustomSorting)
        : uncustomisedSorting,
    [stringCustomSorting, uncustomisedSorting, isCustomDecoder],
  );

  return {
    sorting,
    onSortingChange: useCallback(
      async (updater) => {
        const newSorting = functionalUpdate(updater, sorting);
        const encoder = (sorting: State["sorting"]) =>
          options?.encoder
            ? options.encoder(sorting)
            : {
                [paramName]: encodeSorting(sorting, defaultSorting),
              };
        await updateQuery({
          oldQuery: encoder(sorting),
          newQuery: encoder(newSorting),
          router,
        });
      },
      [router, sorting, paramName, options?.encoder, defaultSorting],
    ),
  };
};
