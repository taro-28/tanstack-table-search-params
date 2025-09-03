import { describe, expect, test } from "vitest";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";
import {
  decodeRowSelection,
  defaultDefaultRowSelection,
  encodeRowSelection,
} from "./rowSelection";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodeRowSelection>[1]>["defaultValue"]
>;

const customDefaultValue = { bar: true };

describe("rowSelection", () => {
  describe("encode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultRowSelection,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeRowSelection>[0];
        want: ReturnType<typeof encodeRowSelection>;
      }>([
        {
          name: "default value",
          stateValue: defaultValue,
          want: undefined,
        },
        {
          name: "empty object",
          stateValue: {},
          want:
            JSON.stringify(defaultValue) ===
            JSON.stringify(defaultDefaultRowSelection)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        {
          name: "non-empty object",
          stateValue: { foo: true },
          want: "foo",
        },
        {
          name: "multiple items",
          stateValue: { foo: true, bar: true },
          want: "foo,bar",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeRowSelection(stateValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultRowSelection,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        queryValue: Parameters<typeof decodeRowSelection>[0];
        want: ReturnType<typeof decodeRowSelection>;
      }>([
        {
          name: "default value",
          queryValue: encodeRowSelection(defaultValue, { defaultValue }),
          want: defaultValue,
        },
        {
          name: "empty string",
          queryValue: "",
          want: defaultValue,
        },
        {
          name: "noneStringForCustomDefaultValue",
          queryValue: noneStringForCustomDefaultValue,
          want: {},
        },
        {
          name: "string",
          queryValue: "foo",
          want: { foo: true },
        },
        {
          name: "string array",
          queryValue: "foo,bar",
          want: { foo: true, bar: true },
        },
        {
          name: "undefined",
          queryValue: undefined,
          want: defaultValue,
        },
      ])("$name", ({ queryValue, want }) =>
        expect(decodeRowSelection(queryValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultRowSelection,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeRowSelection>[0];
      }>([
        {
          name: "default value",
          stateValue: defaultValue,
        },
        {
          name: "empty object",
          stateValue: {},
        },
        {
          name: "non-empty array",
          stateValue: { foo: true },
        },
        {
          name: "multiple items",
          stateValue: { foo: true, bar: true },
        },
      ])("$name", ({ stateValue }) => {
        expect(
          decodeRowSelection(encodeRowSelection(stateValue, { defaultValue }), {
            defaultValue,
          }),
        ).toEqual(stateValue);
      }),
    ));
});
