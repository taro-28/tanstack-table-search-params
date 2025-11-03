import { describe, expect, test } from "vitest";
import {
  decodeColumnVisibility,
  defaultDefaultColumnVisibility,
  encodeColumnVisibility,
} from "./columnVisibility";
import { noneStringForCustomDefaultValue } from "./consts";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodeColumnVisibility>[1]>["defaultValue"]
>;

const customDefaultValue = { bar: false };

describe("columnVisibility", () => {
  describe("encode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultColumnVisibility,
      },
      { name: "with custom default value", defaultValue: customDefaultValue },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnVisibility>[0];
        want: ReturnType<typeof encodeColumnVisibility>;
      }>([
        { name: "default value", stateValue: defaultValue, want: undefined },
        {
          name: "empty object",
          stateValue: {},
          want:
            JSON.stringify(defaultValue) ===
            JSON.stringify(defaultDefaultColumnVisibility)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        {
          name: "true items",
          stateValue: { foo: true, bar: true },
          want:
            JSON.stringify(defaultValue) ===
            JSON.stringify(defaultDefaultColumnVisibility)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        {
          name: "false items",
          stateValue: { foo: false, bar: false },
          want: "foo,bar",
        },
        {
          name: "mixed items",
          stateValue: { foo: false, bar: true },
          want: "foo",
        },
        {
          name: "column ID with comma",
          stateValue: { "user,data": false },
          want: "user%2Cdata",
        },
        {
          name: "multiple column IDs with comma",
          stateValue: { "user,name": false, "user,age": false },
          want: "user%2Cname,user%2Cage",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeColumnVisibility(stateValue, { defaultValue })).toEqual(
          want,
        ),
      ),
    ));

  describe("decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultColumnVisibility,
      },
      // { name: "with custom default value", defaultValue: customDefaultValue },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        queryValue: Parameters<typeof decodeColumnVisibility>[0];
        want: ReturnType<typeof decodeColumnVisibility>;
      }>([
        {
          name: "default value",
          queryValue: encodeColumnVisibility(defaultValue, { defaultValue }),
          want: defaultValue,
        },
        { name: "empty string", queryValue: "", want: defaultValue },
        {
          name: "noneStringForCustomDefaultValue",
          queryValue: noneStringForCustomDefaultValue,
          want: {},
        },
        { name: "string", queryValue: "foo", want: { foo: false } },
        {
          name: "string array",
          queryValue: "foo,bar",
          want: { foo: false, bar: false },
        },
        {
          name: "column ID with comma",
          queryValue: "user%2Cdata",
          want: { "user,data": false },
        },
        {
          name: "multiple column IDs with comma",
          queryValue: "user%2Cname,user%2Cage",
          want: { "user,name": false, "user,age": false },
        },
        { name: "undefined", queryValue: undefined, want: defaultValue },
      ])("$name", ({ queryValue, want }) =>
        expect(decodeColumnVisibility(queryValue, { defaultValue })).toEqual(
          want,
        ),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultColumnVisibility,
      },
      { name: "with custom default value", defaultValue: customDefaultValue },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnVisibility>[0];
      }>([
        { name: "default value", stateValue: defaultValue },
        { name: "empty object", stateValue: {} },
        { name: "false items", stateValue: { foo: false, bar: false } },
        { name: "column ID with comma", stateValue: { "user,data": false } },
        {
          name: "multiple column IDs with comma",
          stateValue: { "user,name": false, "user,age": false },
        },
      ])("$name", ({ stateValue }) => {
        expect(
          decodeColumnVisibility(
            encodeColumnVisibility(stateValue, { defaultValue }),
            { defaultValue },
          ),
        ).toEqual(stateValue);
      }),
    ));
});
