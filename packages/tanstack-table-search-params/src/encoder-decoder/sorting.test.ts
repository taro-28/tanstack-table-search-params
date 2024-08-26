import { describe, expect, test } from "vitest";
import { defaultDefaultSorting } from "../useSorting";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";
import { decodeSorting, encodeSorting } from "./sorting";

const customDefaultValue = [
  {
    id: "custom",
    desc: true,
  },
];

describe("sorting", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      stateValue: Parameters<typeof encodeSorting>[0];
      defaultValue: Parameters<typeof encodeSorting>[1];
      want: ReturnType<typeof encodeSorting>;
    }>([
      {
        name: "empty array(default value)",
        stateValue: [],
        defaultValue: defaultDefaultSorting,
        want: undefined,
      },
      {
        name: "non-empty array",
        stateValue: [{ id: "foo", desc: true }],
        defaultValue: defaultDefaultSorting,
        want: "foo.desc",
      },
      {
        name: "multiple items",
        stateValue: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
        defaultValue: defaultDefaultSorting,
        want: "foo.desc,bar.asc",
      },
      {
        name: "with custom default value: empty array",
        stateValue: [],
        defaultValue: customDefaultValue,
        want: encodedEmptyStringForCustomDefaultValue,
      },
      {
        name: "with custom default value: default value",
        stateValue: customDefaultValue,
        defaultValue: customDefaultValue,
        want: undefined,
      },
      {
        name: "with custom default value: non-empty array",
        stateValue: [{ id: "foo", desc: true }],
        defaultValue: customDefaultValue,
        want: "foo.desc",
      },
      {
        name: "with custom default value: multiple items",
        stateValue: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
        defaultValue: customDefaultValue,
        want: "foo.desc,bar.asc",
      },
    ])("$name", ({ stateValue, defaultValue, want }) =>
      expect(encodeSorting(stateValue, defaultValue)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeSorting>[0];
      defaultValue: Parameters<typeof decodeSorting>[1];
      want: ReturnType<typeof decodeSorting>;
    }>([
      {
        name: "string",
        queryValue: "foo.desc",
        defaultValue: defaultDefaultSorting,
        want: [{ id: "foo", desc: true }],
      },
      {
        name: "string array",
        queryValue: ["foo.desc"],
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "undefined",
        queryValue: undefined,
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "empty string",
        queryValue: "",
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "encodedEmptyStringForCustomDefaultValue",
        queryValue: encodedEmptyStringForCustomDefaultValue,
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "invalid string",
        queryValue: "foo",
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "invalid order",
        queryValue: "foo.bar",
        defaultValue: defaultDefaultSorting,
        want: [],
      },
      {
        name: "with custom default value: string",
        queryValue: "foo.desc",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", desc: true }],
      },
      {
        name: "with custom default value: string array",
        queryValue: ["foo.desc"],
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: undefined",
        queryValue: undefined,
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: empty string",
        queryValue: "",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: default value",
        queryValue: `${customDefaultValue[0]?.id}.${customDefaultValue[0]?.desc ? "desc" : "asc"}`,
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: encodedEmptyStringForCustomDefaultValue",
        queryValue: encodedEmptyStringForCustomDefaultValue,
        defaultValue: customDefaultValue,
        want: [],
      },
      {
        name: "with custom default value: invalid string",
        queryValue: "foo",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: invalid order",
        queryValue: "foo.bar",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
    ])("$name", ({ queryValue, want, defaultValue }) =>
      expect(decodeSorting(queryValue, defaultValue)).toEqual(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      stateValue: Parameters<typeof encodeSorting>[0];
      defaultValue: Parameters<typeof encodeSorting>[1];
    }>([
      {
        name: "empty array(default value)",
        stateValue: [],
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "non-empty array",
        stateValue: [{ id: "foo", desc: true }],
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "multiple items",
        stateValue: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "with custom default value: empty array",
        stateValue: [],
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: default value",
        stateValue: customDefaultValue,
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: non-empty array",
        stateValue: [{ id: "foo", desc: true }],
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: multiple items",
        stateValue: [
          { id: "foo", desc: true },
          { id: "bar", desc: false },
        ],
        defaultValue: customDefaultValue,
      },
    ])("$name", ({ stateValue, defaultValue }) => {
      expect(
        decodeSorting(encodeSorting(stateValue, defaultValue), defaultValue),
      ).toEqual(stateValue);
    }));
});
