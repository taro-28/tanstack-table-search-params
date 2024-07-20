import { describe, expect, test } from "vitest";
import { decodeSorting, encodeSorting } from "./sorting";

describe("sorting", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      sorting: Parameters<typeof encodeSorting>[0];
      want: ReturnType<typeof encodeSorting>;
    }>([
      {
        name: "empty array",
        sorting: [],
        want: undefined,
      },
      {
        name: "non-empty array",
        sorting: [{ id: "foo", desc: true }],
        want: "foo.desc",
      },
      {
        name: "multiple items",
        sorting: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
        want: "foo.desc,bar.asc",
      },
    ])("$name", ({ sorting, want }) =>
      expect(encodeSorting(sorting)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeSorting>[0];
      want: ReturnType<typeof decodeSorting>;
    }>([
      {
        name: "string",
        queryValue: "foo.desc",
        want: [{ id: "foo", desc: true }],
      },
      {
        name: "string array",
        queryValue: ["foo.desc"],
        want: [],
      },
      {
        name: "undefined",
        queryValue: undefined,
        want: [],
      },
      {
        name: "empty string",
        queryValue: "",
        want: [],
      },
      {
        name: "invalid string",
        queryValue: "foo",
        want: [],
      },
      {
        name: "invalid order",
        queryValue: "foo.bar",
        want: [],
      },
    ])("$name", ({ queryValue, want }) =>
      expect(decodeSorting(queryValue)).toEqual(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      sorting: Parameters<typeof encodeSorting>[0];
    }>([
      {
        name: "empty array",
        sorting: [],
      },
      {
        name: "non-empty array",
        sorting: [{ id: "foo", desc: true }],
      },
      {
        name: "multiple items",
        sorting: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
      },
    ])("$name", ({ sorting }) => {
      expect(decodeSorting(encodeSorting(sorting))).toEqual(sorting);
    }));
});
