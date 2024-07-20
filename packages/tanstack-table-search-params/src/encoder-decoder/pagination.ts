import type { State } from "..";
import type { Query } from "../types";

export const defaultPagination = {
  pageIndex: 0,
  pageSize: 10,
} as const;

export const encodePagination = (
  pagination: State["pagination"],
): {
  pageIndex: Query[string];
  pageSize: Query[string];
} => ({
  pageIndex:
    pagination.pageIndex === defaultPagination.pageIndex
      ? undefined
      : pagination.pageIndex.toString(),
  pageSize:
    pagination.pageSize === defaultPagination.pageSize
      ? undefined
      : pagination.pageSize.toString(),
});

export const decodePagination = (queryValues: {
  pageIndex: Query[string];
  pageSize: Query[string];
}) => {
  const pageIndex = Number(queryValues.pageIndex);
  const pageSize = Number(queryValues.pageSize);
  return {
    pageIndex:
      queryValues.pageIndex === "" || Number.isNaN(pageIndex)
        ? defaultPagination.pageIndex
        : pageIndex,
    pageSize:
      queryValues.pageSize === "" || Number.isNaN(pageSize)
        ? defaultPagination.pageSize
        : pageSize,
  };
};
