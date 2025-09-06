import { describe, expect, test } from "vitest";
import {
  decodeColumnOrder,
  defaultDefaultColumnOrder,
  encodeColumnOrder,
} from "./columnOrder";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodeColumnOrder>[1]>["defaultValue"]
>;

const customDefaultValue = ["custom"];

describe("columnOrder", () => {
  describe("encode", () =>
    describe.each<DefaultValue>([
      defaultDefaultColumnOrder,
      customDefaultValue,
    ])("default value: %defaultValue", (...defaultValue) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnOrder>[0];
        want: ReturnType<typeof encodeColumnOrder>;
      }>([
        { name: "default value", stateValue: defaultValue, want: undefined },
        {
          name: "empty array",
          stateValue: [],
          want:
            JSON.stringify(defaultValue) ===
            JSON.stringify(defaultDefaultColumnOrder)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        { name: "one column", stateValue: ["foo"], want: "foo" },
        {
          name: "one column with comma",
          stateValue: ["foo,bar"],
          want: "foo%2Cbar",
        },
        { name: "two columns", stateValue: ["foo", "bar"], want: "foo,bar" },
        {
          name: "two columns with comma",
          stateValue: ["foo", "bar,baz"],
          want: "foo,bar%2Cbaz",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeColumnOrder(stateValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each([defaultDefaultColumnOrder, customDefaultValue])(
      "default value: %defaultValue",
      (...defaultValue) =>
        test.each<{
          name: string;
          queryValue: Parameters<typeof decodeColumnOrder>[0];
          want: ReturnType<typeof decodeColumnOrder>;
        }>([
          {
            name: "default value",
            queryValue: encodeColumnOrder(defaultValue, { defaultValue }),
            want: defaultValue,
          },
          { name: "empty string", queryValue: "", want: defaultValue },
          {
            name: "noneStringForCustomDefaultValue",
            queryValue: noneStringForCustomDefaultValue,
            want: [],
          },
          { name: "one column", queryValue: "foo", want: ["foo"] },
          {
            name: "one column with comma",
            queryValue: "foo%2Cbar",
            want: ["foo,bar"],
          },
          { name: "two columns", queryValue: "foo,bar", want: ["foo", "bar"] },
          {
            name: "two columns with comma",
            queryValue: "foo,bar%2Cbaz",
            want: ["foo", "bar,baz"],
          },
          {
            name: "invalid string array",
            queryValue: ["invalid"],
            want: defaultValue,
          },
          { name: "undefined", queryValue: undefined, want: defaultValue },
        ])("$name", ({ queryValue, want }) =>
          expect(decodeColumnOrder(queryValue, { defaultValue })).toEqual(want),
        ),
    ));

  describe("encode and decode", () =>
    describe.each<DefaultValue>([
      defaultDefaultColumnOrder,
      customDefaultValue,
    ])("default value: $defaultValue", (...defaultValue) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnOrder>[0];
      }>([
        { name: "default value", stateValue: defaultValue },
        { name: "empty array", stateValue: [] },
        { name: "one column", stateValue: ["foo"] },
        { name: "one column with comma", stateValue: ["foo,bar"] },
        { name: "two columns", stateValue: ["foo", "bar"] },
        { name: "two columns with comma", stateValue: ["foo", "bar,baz"] },
      ])("$name", ({ stateValue }) => {
        expect(
          decodeColumnOrder(encodeColumnOrder(stateValue, { defaultValue }), {
            defaultValue,
          }),
        ).toEqual(stateValue);
      }),
    ));
});
