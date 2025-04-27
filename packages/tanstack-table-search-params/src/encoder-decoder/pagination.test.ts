import { describe, expect, test } from "vitest";
import { defaultDefaultPagination } from "../usePagination";
import { decodePagination, encodePagination } from "./pagination";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodePagination>[1]>["defaultValue"]
>;

const customDefaultValue = {
  pageIndex: 9,
  pageSize: 99,
} as const;

describe("pagination", () => {
  describe("encode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultPagination,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
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
          pagination: defaultValue,
          want: { pageIndex: undefined, pageSize: undefined },
        },
        {
          name: "default pageIndex",
          pagination: {
            pageIndex: defaultValue.pageIndex,
            pageSize: 25,
          },
          want: { pageIndex: undefined, pageSize: "25" },
        },
        {
          name: "default pageSize",
          pagination: {
            pageIndex: 2,
            pageSize: defaultValue.pageSize,
          },
          want: { pageIndex: "3", pageSize: undefined },
        },
        {
          name: "0 pageIndex and pageSize",
          pagination: { pageIndex: 0, pageSize: 0 },
          want: {
            pageIndex: defaultValue.pageIndex === 0 ? undefined : "1",
            pageSize: "0",
          },
        },
        {
          name: "0 pageIndex",
          pagination: { pageIndex: 0, pageSize: 25 },
          want: {
            pageIndex: defaultValue.pageIndex === 0 ? undefined : "1",
            pageSize: "25",
          },
        },
        {
          name: "0 pageSize",
          pagination: { pageIndex: 2, pageSize: 0 },
          want: { pageIndex: "3", pageSize: "0" },
        },
      ])("$name", ({ pagination, want }) =>
        expect(encodePagination(pagination, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultPagination,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        queryValues: Parameters<typeof decodePagination>[0];
        want: ReturnType<typeof decodePagination>;
      }>([
        {
          name: "default pageIndex and pageSize",
          queryValues: encodePagination(defaultValue, { defaultValue }),
          want: defaultValue,
        },
        {
          name: "basic",
          queryValues: { pageIndex: "2", pageSize: "25" },
          want: { pageIndex: 1, pageSize: 25 },
        },
        {
          name: "invalid pageIndex and pageSize",
          queryValues: { pageIndex: "foo", pageSize: "bar" },
          want: defaultValue,
        },
        {
          name: "invalid pageIndex",
          queryValues: { pageIndex: "foo", pageSize: "25" },
          want: { pageIndex: defaultValue.pageIndex, pageSize: 25 },
        },
        {
          name: "invalid pageSize",
          queryValues: { pageIndex: "2", pageSize: "foo" },
          want: { pageIndex: 1, pageSize: defaultValue.pageSize },
        },
        {
          name: "undefined pageIndex and pageSize",
          queryValues: { pageIndex: undefined, pageSize: undefined },
          want: defaultValue,
        },
        {
          name: "undefined pageSize",
          queryValues: { pageIndex: "2", pageSize: undefined },
          want: { pageIndex: 1, pageSize: defaultValue.pageSize },
        },
        {
          name: "undefined pageIndex",
          queryValues: { pageIndex: undefined, pageSize: "25" },
          want: { pageIndex: defaultValue.pageIndex, pageSize: 25 },
        },
        {
          name: "empty pageIndex and pageSize",
          queryValues: { pageIndex: "", pageSize: "" },
          want: defaultValue,
        },
        {
          name: "empty pageIndex",
          queryValues: { pageIndex: "", pageSize: "25" },
          want: { pageIndex: defaultValue.pageIndex, pageSize: 25 },
        },
        {
          name: "empty pageSize",
          queryValues: { pageIndex: "2", pageSize: "" },
          want: { pageIndex: 1, pageSize: defaultValue.pageSize },
        },
        {
          name: "0 pageIndex and pageSize",
          queryValues: { pageIndex: "0", pageSize: "0" },
          want: { pageIndex: defaultValue.pageIndex, pageSize: 0 },
        },
        {
          name: "pageIndex is 0",
          queryValues: { pageIndex: "0", pageSize: "25" },
          want: { pageIndex: defaultValue.pageIndex, pageSize: 25 },
        },
        {
          name: "pageSize is 0",
          queryValues: { pageIndex: "2", pageSize: "0" },
          want: { pageIndex: 1, pageSize: 0 },
        },
      ])("$name", ({ queryValues, want }) =>
        expect(decodePagination(queryValues, { defaultValue })).toEqual(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultPagination,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
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
          pagination: defaultValue,
        },
        {
          name: "0 pageIndex and pageSize",
          pagination: { pageIndex: 0, pageSize: 0 },
        },
      ])("$name", ({ pagination }) =>
        expect(
          decodePagination(encodePagination(pagination, { defaultValue }), {
            defaultValue,
          }),
        ).toEqual(pagination),
      ),
    ));
});
