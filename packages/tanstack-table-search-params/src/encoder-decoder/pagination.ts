import type { State } from "..";
import type { Query } from "../types";

export const encodePagination = (
  stateValue: State["pagination"],
  defaultValue: State["pagination"],
): {
  pageIndex: Query[string];
  pageSize: Query[string];
} => ({
  pageIndex:
    stateValue.pageIndex === defaultValue.pageIndex
      ? undefined
      : (stateValue.pageIndex + 1).toString(),
  pageSize:
    stateValue.pageSize === defaultValue.pageSize
      ? undefined
      : stateValue.pageSize.toString(),
});

export const decodePagination = (
  queryValues: {
    pageIndex: Query[string];
    pageSize: Query[string];
  },
  defaultValue: State["pagination"],
) => {
  const pageIndex = Number(queryValues.pageIndex);
  const pageSize = Number(queryValues.pageSize);

  return {
    pageIndex:
      queryValues.pageIndex === "" || Number.isNaN(pageIndex) || pageIndex < 1
        ? defaultValue.pageIndex
        : pageIndex - 1,
    pageSize:
      queryValues.pageSize === "" || Number.isNaN(pageSize)
        ? defaultValue.pageSize
        : pageSize,
  };
};
