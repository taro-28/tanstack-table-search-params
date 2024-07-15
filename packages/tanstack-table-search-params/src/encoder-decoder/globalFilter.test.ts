import { describe, expect, test } from "vitest";
import { decodeGlobalFilter, encodeGlobalFilter } from "./globalFilter";

describe("encodeGlobalFilter", () => {
  test.each<
    {
      name: string;
      want: ReturnType<typeof encodeGlobalFilter>;
    } & Parameters<typeof encodeGlobalFilter>[0]
  >([
    {
      name: "empty string",
      stateValue: "",
      paramName: "globalFilter",
      want: {},
    },
    {
      name: "non-empty string",
      stateValue: "foo",
      paramName: "globalFilter",
      want: { globalFilter: "foo" },
    },
  ])("$name", ({ stateValue, paramName, want }) => {
    expect(encodeGlobalFilter({ stateValue, paramName })).toEqual(want);
  });
});

describe("decodeGlobalFilter", () => {
  test.each<
    {
      name: string;
      want: ReturnType<typeof decodeGlobalFilter>;
    } & Parameters<typeof decodeGlobalFilter>[0]
  >([
    {
      name: "string",
      query: { globalFilter: "foo" },
      paramName: "globalFilter",
      want: "foo",
    },
    {
      name: "string array",
      query: { globalFilter: ["foo"] },
      paramName: "globalFilter",
      want: "",
    },
    {
      name: "undefined",
      query: {},
      paramName: "globalFilter",
      want: "",
    },
    {
      name: "empty string",
      query: { globalFilter: "" },
      paramName: "globalFilter",
      want: "",
    },
  ])("$name", ({ query, paramName, want }) => {
    expect(decodeGlobalFilter({ query, paramName })).toBe(want);
  });
});

describe("encode and decode globalFilter", () => {
  test.each<
    {
      name: string;
    } & Parameters<typeof encodeGlobalFilter>[0]
  >([
    {
      name: "empty string",
      stateValue: "",
      paramName: "globalFilter",
    },
    {
      name: "non-empty string",
      stateValue: "foo",
      paramName: "globalFilter",
    },
  ])("$name", ({ stateValue, paramName }) => {
    expect(
      decodeGlobalFilter({
        query: encodeGlobalFilter({ stateValue, paramName }),
        paramName,
      }),
    ).toBe(stateValue);
  });
});
