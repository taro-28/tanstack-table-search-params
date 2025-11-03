import { functionalUpdate, type OnChangeFn } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodeRowSelection,
  encodeRowSelection,
} from "./encoder-decoder/rowSelection";
import type { Query, Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"rowSelection">;
};

type Returns = {
  rowSelection: State["rowSelection"];
  rowSelectionEncoder: (rowSelection: State["rowSelection"]) => Query;
  onRowSelectionChange: OnChangeFn<State["rowSelection"]>;
};

export const useRowSelection = ({ router, options }: Props): Returns => {
  const paramName =
    (typeof options?.paramName === "function"
      ? options?.paramName(PARAM_NAMES.ROW_SELECTION)
      : options?.paramName) || PARAM_NAMES.ROW_SELECTION;

  const stringDefaultRowSelection =
    options?.defaultValue && JSON.stringify(options?.defaultValue);

  const uncustomisedRowSelection = useMemo(
    () =>
      decodeRowSelection(router.query[paramName], {
        defaultValue:
          stringDefaultRowSelection === undefined
            ? undefined
            : JSON.parse(stringDefaultRowSelection),
      }),
    [router.query[paramName], paramName, stringDefaultRowSelection],
  );

  // If `router.query` is included in the dependency array,
  // `rowSelection` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomRowSelection = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _rowSelection = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomRowSelection === ""
          ? {}
          : JSON.parse(stringCustomRowSelection)
        : uncustomisedRowSelection,
    [stringCustomRowSelection, uncustomisedRowSelection, isCustomDecoder],
  );

  const rowSelectionEncoder = useCallback(
    (rowSelection: State["rowSelection"]) =>
      options?.encoder
        ? options.encoder(rowSelection)
        : {
            [paramName]: encodeRowSelection(rowSelection, {
              defaultValue:
                stringDefaultRowSelection === undefined
                  ? undefined
                  : JSON.parse(stringDefaultRowSelection),
            }),
          },
    [paramName, stringDefaultRowSelection, options],
  );

  const updateRowSelectionQuery = useCallback(
    (newRowSelection: State["rowSelection"]) =>
      updateQuery({
        oldQuery: rowSelectionEncoder(_rowSelection),
        newQuery: rowSelectionEncoder(newRowSelection),
        router,
      }),
    [router, rowSelectionEncoder, _rowSelection],
  );

  const [debouncedRowSelection, setDebouncedRowSelection] = useDebounce({
    stateValue: _rowSelection,
    updateQuery: updateRowSelectionQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const rowSelection = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _rowSelection
        : debouncedRowSelection,
    [_rowSelection, debouncedRowSelection, options?.debounceMilliseconds],
  );

  return {
    rowSelection,
    rowSelectionEncoder,
    onRowSelectionChange: useCallback(
      async (updater) => {
        const newRowSelection = functionalUpdate(updater, rowSelection);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedRowSelection(newRowSelection);
          return;
        }
        await updateRowSelectionQuery(newRowSelection);
      },
      [
        rowSelection,
        options?.debounceMilliseconds,
        updateRowSelectionQuery,
        setDebouncedRowSelection,
      ],
    ),
  };
};
