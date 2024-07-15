import { describe, expect, test } from "vitest";
import { decodeSorting, encodeSorting } from "./sorting";

describe("encodeSorting", () => {
  test.each<
    {
      name: string;
      want: ReturnType<typeof encodeSorting>;
    } & Parameters<typeof encodeSorting>[0]
  >([
    {
      name: "empty array",
      stateValue: [],
      paramName: "sorting",
      want: {},
    },
    {
      name: "non-empty array",
      stateValue: [{ id: "foo", desc: true }],
      paramName: "sorting",
      want: { sorting: "foo.desc" },
    },
    {
      name: "multiple items",
      stateValue: [
        { id: "foo", desc: true },
        { id: "bar", desc: false },
      ],
      paramName: "sorting",
      want: { sorting: "foo.desc,bar.asc" },
    },
  ])("$name", ({ stateValue, paramName, want }) => {
    expect(encodeSorting({ stateValue, paramName })).toEqual(want);
  });
});

describe("decodeSorting", () => {
  test.each<
    {
      name: string;
      want: ReturnType<typeof decodeSorting>;
    } & Parameters<typeof decodeSorting>[0]
  >([
    {
      name: "string",
      query: { sorting: "foo.desc" },
      paramName: "sorting",
      want: [{ id: "foo", desc: true }],
    },
    {
      name: "string array",
      query: { sorting: ["foo.desc"] },
      paramName: "sorting",
      want: [],
    },
    {
      name: "undefined",
      query: {},
      paramName: "sorting",
      want: [],
    },
    {
      name: "empty string",
      query: { sorting: "" },
      paramName: "sorting",
      want: [],
    },
    {
      name: "invalid string",
      query: { sorting: "foo" },
      paramName: "sorting",
      want: [],
    },
    {
      name: "invalid order",
      query: { sorting: "foo.bar" },
      paramName: "sorting",
      want: [],
    },
  ])("$name", ({ query, paramName, want }) => {
    expect(decodeSorting({ query, paramName })).toEqual(want);
  });
});

describe("encode and decode sorting", () => {
  test.each<
    {
      name: string;
    } & Parameters<typeof encodeSorting>[0]
  >([
    {
      name: "empty array",
      stateValue: [],
      paramName: "sorting",
    },
    {
      name: "non-empty array",
      stateValue: [{ id: "foo", desc: true }],
      paramName: "sorting",
    },
    {
      name: "multiple items",
      stateValue: [
        { id: "foo", desc: true },
        { id: "bar", desc: false },
      ],
      paramName: "sorting",
    },
  ])("$name", ({ stateValue, paramName }) => {
    expect(
      decodeSorting({
        query: encodeSorting({ stateValue, paramName }),
        paramName,
      }),
    ).toEqual(stateValue);
  });
});
