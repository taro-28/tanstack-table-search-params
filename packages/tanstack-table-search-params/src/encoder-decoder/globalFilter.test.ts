import { describe, expect, test } from "vitest";
import { decodeGlobalFilter, encodeGlobalFilter } from "./globalFilter";

describe("globalFilter", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      globalFilter: Parameters<typeof encodeGlobalFilter>[0];
      want: ReturnType<typeof encodeGlobalFilter>;
    }>([
      {
        name: "valid",
        globalFilter: "foo",
        want: "foo",
      },
      {
        name: "empty",
        globalFilter: "",
        want: undefined,
      },
    ])("$name", ({ globalFilter, want }) =>
      expect(encodeGlobalFilter(globalFilter)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeGlobalFilter>[0];
      want: ReturnType<typeof decodeGlobalFilter>;
    }>([
      {
        name: "string",
        queryValue: "foo",
        want: "foo",
      },
      {
        name: "empty",
        queryValue: "",
        want: "",
      },
      {
        name: "string array",
        queryValue: ["foo"],
        want: "",
      },
      {
        name: "undefined",
        queryValue: undefined,
        want: "",
      },
    ])("$name", ({ queryValue, want }) =>
      expect(decodeGlobalFilter(queryValue)).toBe(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      globalFilter: Parameters<typeof encodeGlobalFilter>[0];
    }>([
      {
        name: "empty string",
        globalFilter: "",
      },
      {
        name: "non-empty string",
        globalFilter: "foo",
      },
    ])("$name", ({ globalFilter }) =>
      expect(decodeGlobalFilter(encodeGlobalFilter(globalFilter))).toBe(
        globalFilter,
      ),
    ));
});
