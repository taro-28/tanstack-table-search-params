import { describe, expect, test } from "vitest";
import { defaultDefaultPagination } from "../usePagination";
import { decodePagination, encodePagination } from "./pagination";

const customDefaultValue = {
  pageIndex: 9,
  pageSize: 99,
} as const;

describe("pagination", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      pagination: Parameters<typeof encodePagination>[0];
      defaultValue: Parameters<typeof encodePagination>[1];
      want: ReturnType<typeof encodePagination>;
    }>([
      {
        name: "basic",
        pagination: { pageIndex: 2, pageSize: 50 },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: "3", pageSize: "50" },
      },
      {
        name: "default pageIndex and pageSize",
        pagination: defaultDefaultPagination,
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: undefined, pageSize: undefined },
      },
      {
        name: "default pageIndex",
        pagination: {
          pageIndex: defaultDefaultPagination.pageIndex,
          pageSize: 25,
        },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: undefined, pageSize: "25" },
      },
      {
        name: "default pageSize",
        pagination: {
          pageIndex: 2,
          pageSize: defaultDefaultPagination.pageSize,
        },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: "3", pageSize: undefined },
      },
      {
        name: "0 pageIndex and pageSize",
        pagination: { pageIndex: 0, pageSize: 0 },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: undefined, pageSize: "0" },
      },
      {
        name: "0 pageIndex",
        pagination: { pageIndex: 0, pageSize: 25 },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: undefined, pageSize: "25" },
      },
      {
        name: "0 pageSize",
        pagination: { pageIndex: 2, pageSize: 0 },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: "3", pageSize: "0" },
      },
      {
        name: "with custom default value: basic",
        pagination: { pageIndex: 2, pageSize: 50 },
        defaultValue: customDefaultValue,
        want: { pageIndex: "3", pageSize: "50" },
      },
      {
        name: "with custom default value: default pageIndex and pageSize",
        pagination: customDefaultValue,
        defaultValue: customDefaultValue,
        want: { pageIndex: undefined, pageSize: undefined },
      },
      {
        name: "with custom default value: default pageIndex",
        pagination: {
          pageIndex: customDefaultValue.pageIndex,
          pageSize: 50,
        },
        defaultValue: customDefaultValue,
        want: { pageIndex: undefined, pageSize: "50" },
      },
      {
        name: "with custom default value: default pageSize",
        pagination: {
          pageIndex: 2,
          pageSize: customDefaultValue.pageSize,
        },
        defaultValue: customDefaultValue,
        want: { pageIndex: "3", pageSize: undefined },
      },
      {
        name: "with custom default value: 0 pageIndex and pageSize",
        pagination: { pageIndex: 0, pageSize: 0 },
        defaultValue: customDefaultValue,
        want: { pageIndex: "1", pageSize: "0" },
      },
      {
        name: "with custom default value: 0 pageIndex",
        pagination: { pageIndex: 0, pageSize: 25 },
        defaultValue: customDefaultValue,
        want: { pageIndex: "1", pageSize: "25" },
      },
      {
        name: "with custom default value: 0 pageSize",
        pagination: { pageIndex: 2, pageSize: 0 },
        defaultValue: customDefaultValue,
        want: { pageIndex: "3", pageSize: "0" },
      },
    ])("$name", ({ pagination, want, defaultValue }) =>
      expect(encodePagination(pagination, defaultValue)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValues: Parameters<typeof decodePagination>[0];
      defaultValue: Parameters<typeof decodePagination>[1];
      want: ReturnType<typeof decodePagination>;
    }>([
      {
        name: "basic",
        queryValues: { pageIndex: "2", pageSize: "25" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 1, pageSize: 25 },
      },
      {
        name: "invalid pageIndex and pageSize",
        queryValues: { pageIndex: "foo", pageSize: "bar" },
        defaultValue: defaultDefaultPagination,
        want: defaultDefaultPagination,
      },
      {
        name: "invalid pageIndex",
        queryValues: { pageIndex: "foo", pageSize: "25" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: defaultDefaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "invalid pageSize",
        queryValues: { pageIndex: "2", pageSize: "foo" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 1, pageSize: defaultDefaultPagination.pageSize },
      },
      {
        name: "undefined pageIndex and pageSize",
        queryValues: { pageIndex: undefined, pageSize: undefined },
        defaultValue: defaultDefaultPagination,
        want: defaultDefaultPagination,
      },
      {
        name: "undefined pageSize",
        queryValues: { pageIndex: "2", pageSize: undefined },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 1, pageSize: defaultDefaultPagination.pageSize },
      },
      {
        name: "undefined pageIndex",
        queryValues: { pageIndex: undefined, pageSize: "25" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: defaultDefaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "empty pageIndex and pageSize",
        queryValues: { pageIndex: "", pageSize: "" },
        defaultValue: defaultDefaultPagination,
        want: defaultDefaultPagination,
      },
      {
        name: "empty pageIndex",
        queryValues: { pageIndex: "", pageSize: "25" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: defaultDefaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "empty pageSize",
        queryValues: { pageIndex: "2", pageSize: "" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 1, pageSize: defaultDefaultPagination.pageSize },
      },
      {
        name: "0 pageIndex and pageSize",
        queryValues: { pageIndex: "0", pageSize: "0" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 0, pageSize: 0 },
      },
      {
        name: "pageIndex is 0",
        queryValues: { pageIndex: "0", pageSize: "25" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 0, pageSize: 25 },
      },
      {
        name: "pageSize is 0",
        queryValues: { pageIndex: "2", pageSize: "0" },
        defaultValue: defaultDefaultPagination,
        want: { pageIndex: 1, pageSize: 0 },
      },
      {
        name: "with custom default value: basic",
        queryValues: { pageIndex: "2", pageSize: "25" },
        defaultValue: customDefaultValue,
        want: { pageIndex: 1, pageSize: 25 },
      },
      {
        name: "with custom default value: invalid pageIndex and pageSize",
        queryValues: { pageIndex: "foo", pageSize: "bar" },
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: invalid pageIndex",
        queryValues: { pageIndex: "foo", pageSize: "25" },
        defaultValue: customDefaultValue,
        want: { pageIndex: customDefaultValue.pageIndex, pageSize: 25 },
      },
      {
        name: "with custom default value: invalid pageSize",
        queryValues: { pageIndex: "2", pageSize: "foo" },
        defaultValue: customDefaultValue,
        want: { pageIndex: 1, pageSize: customDefaultValue.pageSize },
      },
      {
        name: "with custom default value: undefined pageIndex and pageSize",
        queryValues: { pageIndex: undefined, pageSize: undefined },
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: undefined pageSize",
        queryValues: { pageIndex: "2", pageSize: undefined },
        defaultValue: customDefaultValue,
        want: { pageIndex: 1, pageSize: customDefaultValue.pageSize },
      },
      {
        name: "with custom default value: undefined pageIndex",
        queryValues: { pageIndex: undefined, pageSize: "25" },
        defaultValue: customDefaultValue,
        want: { pageIndex: customDefaultValue.pageIndex, pageSize: 25 },
      },
      {
        name: "with custom default value: empty pageIndex and pageSize",
        queryValues: { pageIndex: "", pageSize: "" },
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: empty pageIndex",
        queryValues: { pageIndex: "", pageSize: "25" },
        defaultValue: customDefaultValue,
        want: { pageIndex: customDefaultValue.pageIndex, pageSize: 25 },
      },
      {
        name: "with custom default value: empty pageSize",
        queryValues: { pageIndex: "2", pageSize: "" },
        defaultValue: customDefaultValue,
        want: { pageIndex: 1, pageSize: customDefaultValue.pageSize },
      },
      {
        name: "with custom default value: 0 pageIndex and pageSize",
        queryValues: { pageIndex: "0", pageSize: "0" },
        defaultValue: customDefaultValue,
        want: { pageIndex: customDefaultValue.pageIndex, pageSize: 0 },
      },
      {
        name: "with custom default value: pageIndex is 0",
        queryValues: { pageIndex: "0", pageSize: "25" },
        defaultValue: customDefaultValue,
        want: { pageIndex: customDefaultValue.pageIndex, pageSize: 25 },
      },
      {
        name: "with custom default value: pageSize is 0",
        queryValues: { pageIndex: "2", pageSize: "0" },
        defaultValue: customDefaultValue,
        want: { pageIndex: 1, pageSize: 0 },
      },
    ])("$name", ({ queryValues, want, defaultValue }) =>
      expect(decodePagination(queryValues, defaultValue)).toEqual(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      pagination: Parameters<typeof encodePagination>[0];
      defaultValue: Parameters<typeof encodePagination>[1];
    }>([
      {
        name: "basic",
        pagination: { pageIndex: 2, pageSize: 25 },
        defaultValue: defaultDefaultPagination,
      },
      {
        name: "default",
        pagination: defaultDefaultPagination,
        defaultValue: defaultDefaultPagination,
      },
      {
        name: "custom default value: basic",
        pagination: { pageIndex: 2, pageSize: 25 },
        defaultValue: customDefaultValue,
      },
      {
        name: "default",
        pagination: defaultDefaultPagination,
        defaultValue: customDefaultValue,
      },
    ])("$name", ({ pagination, defaultValue }) =>
      expect(
        decodePagination(
          encodePagination(pagination, defaultValue),
          defaultValue,
        ),
      ).toEqual(pagination),
    ));
});
