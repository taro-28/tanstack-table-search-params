import { describe, expect, test } from "vitest";
import { defaultDefaultGlobalFilter } from "../useGlobalFilter";
import {
  decodeGlobalFilter,
  encodeGlobalFilter,
  encodedEmptyStringForGlobalFilterCustomDefaultValue,
} from "./globalFilter";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodeGlobalFilter>[1]>["defaultValue"]
>;

const customDefaultValue = "default";

describe("globalFilter", () => {
  describe("encode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeGlobalFilter>[0];
        want: ReturnType<typeof encodeGlobalFilter>;
      }>([
        {
          name: "default value",
          stateValue: defaultValue,
          want: undefined,
        },
        {
          name: "empty string",
          stateValue: "",
          want:
            defaultValue === ""
              ? undefined
              : encodedEmptyStringForGlobalFilterCustomDefaultValue,
        },
        {
          name: "encodedEmptyStringForGlobalFilterCustomDefaultValue",
          stateValue: encodedEmptyStringForGlobalFilterCustomDefaultValue,
          want: encodedEmptyStringForGlobalFilterCustomDefaultValue,
        },
        {
          name: "valid",
          stateValue: "foo",
          want: "foo",
        },
        {
          name: "not string",
          stateValue: 1,
          want: defaultValue,
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeGlobalFilter(stateValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        queryValue: Parameters<typeof decodeGlobalFilter>[0];
        want: ReturnType<typeof decodeGlobalFilter>;
      }>([
        {
          name: "default value",
          queryValue: defaultValue,
          want: defaultValue,
        },
        {
          name: "empty string",
          queryValue: "",
          want: "",
        },
        {
          name: "encodedEmptyStringForGlobalFilterCustomDefaultValue",
          queryValue: encodedEmptyStringForGlobalFilterCustomDefaultValue,
          want:
            defaultValue === ""
              ? encodedEmptyStringForGlobalFilterCustomDefaultValue
              : "",
        },
        {
          name: "string",
          queryValue: "foo",
          want: "foo",
        },
        {
          name: "string array",
          queryValue: ["foo"],
          want: defaultValue,
        },
        {
          name: "undefined",
          queryValue: undefined,
          want: defaultValue,
        },
      ])("$name", ({ queryValue, want }) =>
        expect(decodeGlobalFilter(queryValue, { defaultValue })).toBe(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        globalFilter: Parameters<typeof encodeGlobalFilter>[0];
        wantDecoded?: ReturnType<typeof decodeGlobalFilter>;
      }>([
        {
          name: "default value",
          globalFilter: defaultValue,
        },
        {
          name: "empty string",
          globalFilter: "",
        },
        {
          name: "non-empty string",
          globalFilter: "foo",
        },
        {
          name: "encodedEmptyStringForGlobalFilterCustomDefaultValue",
          globalFilter: encodedEmptyStringForGlobalFilterCustomDefaultValue,
          wantDecoded:
            defaultValue === ""
              ? encodedEmptyStringForGlobalFilterCustomDefaultValue
              : "",
        },
      ])("$name", ({ globalFilter, wantDecoded }) =>
        expect(
          decodeGlobalFilter(
            encodeGlobalFilter(globalFilter, { defaultValue }),
            { defaultValue },
          ),
        ).toBe(wantDecoded ?? globalFilter),
      ),
    ));
});
