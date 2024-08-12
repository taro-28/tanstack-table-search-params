import { describe, expect, test } from "vitest";
import {
  decodePagination,
  defaultPagination,
  encodePagination,
} from "./pagination";

describe("pagination", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      pagination: Parameters<typeof encodePagination>[0];
      want: ReturnType<typeof encodePagination>;
    }>([
      {
        name: "basic",
        pagination: { pageIndex: 2, pageSize: 50 },
        want: { pageIndex: "3", pageSize: "50" },
      },
      {
        name: "default pageIndex and pageSize",
        pagination: defaultPagination,
        want: { pageIndex: undefined, pageSize: undefined },
      },
      {
        name: "default pageIndex",
        pagination: { pageIndex: defaultPagination.pageIndex, pageSize: 25 },
        want: { pageIndex: undefined, pageSize: "25" },
      },
      {
        name: "default pageSize",
        pagination: { pageIndex: 2, pageSize: defaultPagination.pageSize },
        want: { pageIndex: "3", pageSize: undefined },
      },
      {
        name: "0 pageIndex and pageSize",
        pagination: { pageIndex: 0, pageSize: 0 },
        want: { pageIndex: undefined, pageSize: "0" },
      },
      {
        name: "0 pageIndex",
        pagination: { pageIndex: 0, pageSize: 25 },
        want: { pageIndex: undefined, pageSize: "25" },
      },
      {
        name: "0 pageSize",
        pagination: { pageIndex: 2, pageSize: 0 },
        want: { pageIndex: "3", pageSize: "0" },
      },
    ])("$name", ({ pagination, want }) =>
      expect(encodePagination(pagination)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValues: Parameters<typeof decodePagination>[0];
      want: ReturnType<typeof decodePagination>;
    }>([
      {
        name: "basic",
        queryValues: { pageIndex: "2", pageSize: "25" },
        want: { pageIndex: 1, pageSize: 25 },
      },
      {
        name: "invalid pageIndex and pageSize",
        queryValues: { pageIndex: "foo", pageSize: "bar" },
        want: defaultPagination,
      },
      {
        name: "invalid pageIndex",
        queryValues: { pageIndex: "foo", pageSize: "25" },
        want: { pageIndex: defaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "invalid pageSize",
        queryValues: { pageIndex: "2", pageSize: "foo" },
        want: { pageIndex: 1, pageSize: defaultPagination.pageSize },
      },
      {
        name: "undefined pageIndex and pageSize",
        queryValues: { pageIndex: undefined, pageSize: undefined },
        want: defaultPagination,
      },
      {
        name: "undefined pageSize",
        queryValues: { pageIndex: "2", pageSize: undefined },
        want: { pageIndex: 1, pageSize: defaultPagination.pageSize },
      },
      {
        name: "undefined pageIndex",
        queryValues: { pageIndex: undefined, pageSize: "25" },
        want: { pageIndex: defaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "empty pageIndex and pageSize",
        queryValues: { pageIndex: "", pageSize: "" },
        want: defaultPagination,
      },
      {
        name: "empty pageIndex",
        queryValues: { pageIndex: "", pageSize: "25" },
        want: { pageIndex: defaultPagination.pageIndex, pageSize: 25 },
      },
      {
        name: "empty pageSize",
        queryValues: { pageIndex: "2", pageSize: "" },
        want: { pageIndex: 1, pageSize: defaultPagination.pageSize },
      },
      {
        name: "0 pageIndex and pageSize",
        queryValues: { pageIndex: "0", pageSize: "0" },
        want: { pageIndex: 0, pageSize: 0 },
      },
      {
        name: "pageIndex is 0",
        queryValues: { pageIndex: "0", pageSize: "25" },
        want: { pageIndex: 0, pageSize: 25 },
      },
      {
        name: "pageSize is 0",
        queryValues: { pageIndex: "2", pageSize: "0" },
        want: { pageIndex: 1, pageSize: 0 },
      },
    ])("$name", ({ queryValues, want }) =>
      expect(decodePagination(queryValues)).toEqual(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      pagination: Parameters<typeof encodePagination>[0];
    }>([
      {
        name: "basic",
        pagination: { pageIndex: 2, pageSize: 25 },
      },
      {
        name: "default",
        pagination: defaultPagination,
      },
    ])("$name", ({ pagination }) =>
      expect(decodePagination(encodePagination(pagination))).toEqual(
        pagination,
      ),
    ));
});
