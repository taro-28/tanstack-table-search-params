import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeColumnOrder,
  encodeColumnOrder,
} from "./encoder-decoder/columnOrder";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"columnOrder">;
};

type Returns = {
  columnOrder: State["columnOrder"];
  onColumnOrderChange: OnChangeFn<State["columnOrder"]>;
};

export const useColumnOrder = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.COLUMN_ORDER)
      : options?.paramName) || PARAM_NAMES.COLUMN_ORDER;

  const stringDefaultColumnOrder =
    options?.defaultValue && JSON.stringify(options?.defaultValue);

  const uncustomisedColumnOrder = useMemo(
    () =>
      decodeColumnOrder(router.query[paramName], {
        defaultValue:
          stringDefaultColumnOrder === undefined
            ? undefined
            : JSON.parse(stringDefaultColumnOrder),
      }),
    [router.query[paramName], paramName, stringDefaultColumnOrder],
  );

  // If `router.query` is included in the dependency array,
  // `columnOrder` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomColumnOrder = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _columnOrder = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomColumnOrder === ""
          ? []
          : JSON.parse(stringCustomColumnOrder)
        : uncustomisedColumnOrder,
    [stringCustomColumnOrder, uncustomisedColumnOrder, isCustomDecoder],
  );

  const updateColumnOrderQuery = useCallback(
    async (newColumnOrder: State["columnOrder"]) => {
      const encoder = (columnOrder: State["columnOrder"]) =>
        options?.encoder
          ? options.encoder(columnOrder)
          : {
              [paramName]: encodeColumnOrder(columnOrder, {
                defaultValue:
                  stringDefaultColumnOrder === undefined
                    ? undefined
                    : JSON.parse(stringDefaultColumnOrder),
              }),
            };
      await updateQuery({
        oldQuery: encoder(_columnOrder),
        newQuery: encoder(newColumnOrder),
        router,
      });
    },
    [
      router,
      paramName,
      options?.encoder,
      stringDefaultColumnOrder,
      _columnOrder,
    ],
  );

  const [debouncedColumnOrder, setDebouncedColumnOrder] = useDebounce({
    stateValue: _columnOrder,
    updateQuery: updateColumnOrderQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const columnOrder = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _columnOrder
        : debouncedColumnOrder,
    [_columnOrder, debouncedColumnOrder, options?.debounceMilliseconds],
  );

  return {
    columnOrder,
    onColumnOrderChange: useCallback(
      async (updater) => {
        const newColumnOrder = functionalUpdate(updater, columnOrder);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedColumnOrder(newColumnOrder);
          return;
        }
        await updateColumnOrderQuery(newColumnOrder);
      },
      [
        columnOrder,
        updateColumnOrderQuery,
        options?.debounceMilliseconds,
        setDebouncedColumnOrder,
      ],
    ),
  };
};
