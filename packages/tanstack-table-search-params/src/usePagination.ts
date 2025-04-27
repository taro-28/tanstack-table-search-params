import { type OnChangeFn, functionalUpdate } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { PARAM_NAMES, type State } from ".";
import {
  decodePagination,
  encodePagination,
} from "./encoder-decoder/pagination";
import type { Router } from "./types";
import { updateQuery } from "./updateQuery";
import { useDebounce } from "./useDebounce";
import type { ExtractSpecificStateOptions } from "./utils";

export const defaultDefaultPagination = {
  pageIndex: 0,
  pageSize: 10,
} as const satisfies State["pagination"];

type Props = {
  router: Router;
  options?: ExtractSpecificStateOptions<"pagination">;
};

type Returns = {
  pagination: State["pagination"];
  onPaginationChange: OnChangeFn<State["pagination"]>;
};

export const usePagination = ({ router, options }: Props): Returns => {
  const paramName = useMemo(
    () =>
      (typeof options?.paramName === "function"
        ? options?.paramName({
            pageIndex: PARAM_NAMES.PAGE_INDEX,
            pageSize: PARAM_NAMES.PAGE_SIZE,
          })
        : options?.paramName) || {
        pageIndex: PARAM_NAMES.PAGE_INDEX,
        pageSize: PARAM_NAMES.PAGE_SIZE,
      },
    [options?.paramName],
  );

  const defaultPagination = useMemo(
    () => ({
      pageIndex:
        options?.defaultValue?.pageIndex ?? defaultDefaultPagination.pageIndex,
      pageSize:
        options?.defaultValue?.pageSize ?? defaultDefaultPagination.pageSize,
    }),
    [options?.defaultValue?.pageIndex, options?.defaultValue?.pageSize],
  );

  const uncustomisedPagination = useMemo(
    () =>
      decodePagination(
        {
          pageIndex: router.query[paramName.pageIndex],
          pageSize: router.query[paramName.pageSize],
        },
        {
          defaultValue: {
            pageIndex: defaultPagination.pageIndex,
            pageSize: defaultPagination.pageSize,
          },
        },
      ),
    [
      router.query[paramName.pageIndex],
      router.query[paramName.pageSize],
      paramName.pageIndex,
      paramName.pageSize,
      defaultPagination.pageIndex,
      defaultPagination.pageSize,
    ],
  );

  // If `router.query` is included in the dependency array,
  // `pagination` will always be regenerated.
  // To prevent this, use `JSON.stringify` and `JSON.parse`
  // when utilizing a custom decoder.
  const isCustomDecoder = !!options?.decoder;
  const stringCustomPagination = options?.decoder?.(router.query)
    ? JSON.stringify(options.decoder(router.query))
    : "";
  const _pagination = useMemo(
    () =>
      isCustomDecoder
        ? stringCustomPagination === ""
          ? []
          : JSON.parse(stringCustomPagination)
        : {
            pageIndex: uncustomisedPagination.pageIndex,
            pageSize: uncustomisedPagination.pageSize,
          },
    [
      stringCustomPagination,
      isCustomDecoder,
      uncustomisedPagination.pageIndex,
      uncustomisedPagination.pageSize,
    ],
  );

  const updatePaginationQuery = useCallback(
    async (newPagination: State["pagination"]) => {
      const encoder = (pagination: State["pagination"]) => {
        if (options?.encoder) return options.encoder(pagination);
        const encoded = encodePagination(pagination, {
          defaultValue: {
            pageIndex: defaultPagination.pageIndex,
            pageSize: defaultPagination.pageSize,
          },
        });
        return {
          [paramName.pageIndex]: encoded.pageIndex,
          [paramName.pageSize]: encoded.pageSize,
        };
      };
      await updateQuery({
        oldQuery: encoder(_pagination),
        newQuery: encoder(newPagination),
        router,
      });
    },
    [
      router,
      _pagination,
      paramName,
      options?.encoder,
      defaultPagination.pageIndex,
      defaultPagination.pageSize,
    ],
  );

  const [debouncedPagination, setDebouncedPagination] = useDebounce({
    stateValue: _pagination,
    updateQuery: updatePaginationQuery,
    milliseconds: options?.debounceMilliseconds,
  });

  const pagination = useMemo(
    () =>
      options?.debounceMilliseconds === undefined
        ? _pagination
        : debouncedPagination,
    [_pagination, debouncedPagination, options?.debounceMilliseconds],
  );

  return {
    pagination,
    onPaginationChange: useCallback(
      async (updater) => {
        const newPagination = functionalUpdate(updater, pagination);
        if (options?.debounceMilliseconds !== undefined) {
          setDebouncedPagination(newPagination);
          return;
        }
        await updatePaginationQuery(newPagination);
      },
      [
        pagination,
        updatePaginationQuery,
        options?.debounceMilliseconds,
        setDebouncedPagination,
      ],
    ),
  };
};
