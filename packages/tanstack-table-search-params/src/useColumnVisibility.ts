import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeColumnVisibility,
  encodeColumnVisibility,
} from "./encoder-decoder/columnVisibility";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"columnVisibility">;
};

type Returns = {
  columnVisibility: State["columnVisibility"];
  columnVisibilityEncoder: (
    columnVisibility: State["columnVisibility"],
  ) => Query;
  onColumnVisibilityChange: OnChangeFn<State["columnVisibility"]>;
};

export const useColumnVisibility = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.COLUMN_VISIBILITY)
      : options?.paramName) || PARAM_NAMES.COLUMN_VISIBILITY;

  const stringDefaultColumnVisibility =
    options?.defaultValue && JSON.stringify(options?.defaultValue);

  const uncustomisedColumnVisibility = useMemo(
    () =>
      decodeColumnVisibility(router.query[paramName], {
        defaultValue:
          stringDefaultColumnVisibility === undefined
            ? undefined
            : JSON.parse(stringDefaultColumnVisibility),
      }),
    [router.query[paramName], paramName, stringDefaultColumnVisibility],
  );

  // If `router.query` is included in the dependency array,
  // `columnVisibility` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomColumnVisibility = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _columnVisibility = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomColumnVisibility === ""
          ? {}
          : JSON.parse(stringCustomColumnVisibility)
        : uncustomisedColumnVisibility,
    [
      stringCustomColumnVisibility,
      uncustomisedColumnVisibility,
      isCustomDecoder,
    ],
  );

  const columnVisibilityEncoder = useCallback(
    (columnVisibility: State["columnVisibility"]) =>
      options?.encoder
        ? options.encoder(columnVisibility)
        : {
            [paramName]: encodeColumnVisibility(columnVisibility, {
              defaultValue:
                stringDefaultColumnVisibility === undefined
                  ? undefined
                  : JSON.parse(stringDefaultColumnVisibility),
            }),
          },
    [paramName, options?.encoder, stringDefaultColumnVisibility],
  );

  const updateColumnVisibilityQuery = useCallback(
    (newColumnVisibility: State["columnVisibility"]) =>
      updateQuery({
        oldQuery: columnVisibilityEncoder(_columnVisibility),
        newQuery: columnVisibilityEncoder(newColumnVisibility),
        router,
      }),
    [router, columnVisibilityEncoder, _columnVisibility],
  );

  const [debouncedColumnVisibility, setDebouncedColumnVisibility] = useDebounce(
    {
      stateValue: _columnVisibility,
      updateQuery: updateColumnVisibilityQuery,
      milliseconds: options?.debounceMilliseconds,
    },
  );

  const columnVisibility = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _columnVisibility
        : debouncedColumnVisibility,
    [
      _columnVisibility,
      debouncedColumnVisibility,
      options?.debounceMilliseconds,
    ],
  );

  return {
    columnVisibility,
    columnVisibilityEncoder,
    onColumnVisibilityChange: useCallback(
      async (updater) => {
        const newColumnVisibility = functionalUpdate(updater, columnVisibility);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedColumnVisibility(newColumnVisibility);
          return;
        }
        await updateColumnVisibilityQuery(newColumnVisibility);
      },
      [
        columnVisibility,
        options?.debounceMilliseconds,
        updateColumnVisibilityQuery,
        setDebouncedColumnVisibility,
      ],
    ),
  };
};
