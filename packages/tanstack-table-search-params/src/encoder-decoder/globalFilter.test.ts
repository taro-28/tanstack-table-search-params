import { describe, expect, test } from "vitest";
import { defaultDefaultGlobalFilter } from "../useGlobalFilter";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";
import { decodeGlobalFilter, encodeGlobalFilter } from "./globalFilter";

const customDefaultValue = "default";

describe("globalFilter", () => {
  describe("encode", () =>
    describe.each<{
      name: string;
      defaultValue: Parameters<typeof encodeGlobalFilter>[1];
    }>([
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
              : encodedEmptyStringForCustomDefaultValue,
        },
        {
          name: "encodedEmptyStringForCustomDefaultValue",
          stateValue: encodedEmptyStringForCustomDefaultValue,
          want: encodedEmptyStringForCustomDefaultValue,
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
        expect(encodeGlobalFilter(stateValue, defaultValue)).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{
      name: string;
      defaultValue: Parameters<typeof decodeGlobalFilter>[1];
    }>([
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
          name: "encodedEmptyStringForCustomDefaultValue",
          queryValue: encodedEmptyStringForCustomDefaultValue,
          want:
            defaultValue === "" ? encodedEmptyStringForCustomDefaultValue : "",
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
        expect(decodeGlobalFilter(queryValue, defaultValue)).toBe(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{
      name: string;
      defaultValue: Parameters<typeof encodeGlobalFilter>[1];
    }>([
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
          name: "encodedEmptyStringForCustomDefaultValue",
          globalFilter: encodedEmptyStringForCustomDefaultValue,
          wantDecoded:
            defaultValue === "" ? encodedEmptyStringForCustomDefaultValue : "",
        },
      ])("$name", ({ globalFilter, wantDecoded }) =>
        expect(
          decodeGlobalFilter(
            encodeGlobalFilter(globalFilter, defaultValue),
            defaultValue,
          ),
        ).toBe(wantDecoded ?? globalFilter),
      ),
    ));
});
