import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import { decodeSorting, encodeSorting } from "./encoder-decoder/sorting";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"sorting">;
};

type Returns = {
  sorting: State["sorting"];
  sortingEncoder: (sorting: State["sorting"]) => Query;
  onSortingChange: OnChangeFn<State["sorting"]>;
};

export const useSorting = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.SORTING)
      : options?.paramName) || PARAM_NAMES.SORTING;

  const stringDefaultSorting =
    options?.defaultValue && JSON.stringify(options?.defaultValue);

  const uncustomisedSorting = useMemo(
    () =>
      decodeSorting(router.query[paramName], {
        defaultValue:
          stringDefaultSorting === undefined
            ? undefined
            : JSON.parse(stringDefaultSorting),
      }),
    [router.query[paramName], paramName, stringDefaultSorting],
  );

  // If `router.query` is included in the dependency array,
  // `sorting` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomSorting = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _sorting = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomSorting === ""
          ? []
          : JSON.parse(stringCustomSorting)
        : uncustomisedSorting,
    [stringCustomSorting, uncustomisedSorting, isCustomDecoder],
  );

  const sortingEncoder = useCallback(
    (sorting: State["sorting"]) =>
      options?.encoder
        ? options.encoder(sorting)
        : {
            [paramName]: encodeSorting(sorting, {
              defaultValue:
                stringDefaultSorting === undefined
                  ? undefined
                  : JSON.parse(stringDefaultSorting),
            }),
          },
    [paramName, stringDefaultSorting, options],
  );

  const updateSortingQuery = useCallback(
    (newSorting: State["sorting"]) =>
      updateQuery({
        oldQuery: sortingEncoder(_sorting),
        newQuery: sortingEncoder(newSorting),
        router,
      }),
    [router, sortingEncoder, _sorting],
  );

  const [debouncedSorting, setDebouncedSorting] = useDebounce({
    stateValue: _sorting,
    updateQuery: updateSortingQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const sorting = useMemo(
    () =>
      options?.debounceMilliseconds === undefined ? _sorting : debouncedSorting,
    [_sorting, debouncedSorting, options?.debounceMilliseconds],
  );

  return {
    sorting,
    sortingEncoder,
    onSortingChange: useCallback(
      async (updater) => {
        const newSorting = functionalUpdate(updater, sorting);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedSorting(newSorting);
          return;
        }
        await updateSortingQuery(newSorting);
      },
      [
        sorting,
        options?.debounceMilliseconds,
        updateSortingQuery,
        setDebouncedSorting,
      ],
    ),
  };
};
