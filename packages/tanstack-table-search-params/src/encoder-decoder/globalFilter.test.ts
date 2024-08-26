import { describe, expect, test } from "vitest";
import { defaultDefaultGlobalFilter } from "../useGlobalFilter";
import {
  decodeGlobalFilter,
  encodeGlobalFilter,
  encodedEmptyStringGlobalFilterForCustomDefaultValue,
} from "./globalFilter";

const customDefaultValue = "default";

describe("globalFilter", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      globalFilter: Parameters<typeof encodeGlobalFilter>[0];
      defaultValue: Parameters<typeof encodeGlobalFilter>[1];
      want: ReturnType<typeof encodeGlobalFilter>;
    }>([
      {
        name: "valid",
        globalFilter: "foo",
        defaultValue: defaultDefaultGlobalFilter,
        want: "foo",
      },
      {
        name: "empty(default value)",
        globalFilter: "",
        defaultValue: defaultDefaultGlobalFilter,
        want: undefined,
      },
      {
        name: "encodedEmptyStringGlobalFilterForCustomDefaultValue",
        globalFilter: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: defaultDefaultGlobalFilter,
        want: encodedEmptyStringGlobalFilterForCustomDefaultValue,
      },
      {
        name: "with custom default value: valid",
        globalFilter: "foo",
        defaultValue: customDefaultValue,
        want: "foo",
      },
      {
        name: "with custom default value: empty",
        globalFilter: "",
        defaultValue: customDefaultValue,
        want: encodedEmptyStringGlobalFilterForCustomDefaultValue,
      },
      {
        name: "with custom default value: default value",
        globalFilter: customDefaultValue,
        defaultValue: customDefaultValue,
        want: undefined,
      },
      {
        name: "with custom default value: encodedEmptyStringGlobalFilterForCustomDefaultValue",
        globalFilter: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: customDefaultValue,
        want: encodedEmptyStringGlobalFilterForCustomDefaultValue,
      },
    ])("$name", ({ globalFilter, want, defaultValue }) =>
      expect(encodeGlobalFilter(globalFilter, defaultValue)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeGlobalFilter>[0];
      defaultValue: Parameters<typeof decodeGlobalFilter>[1];
      want: ReturnType<typeof decodeGlobalFilter>;
    }>([
      {
        name: "string",
        queryValue: "foo",
        defaultValue: defaultDefaultGlobalFilter,
        want: "foo",
      },
      {
        name: "empty(default value)",
        queryValue: "",
        defaultValue: defaultDefaultGlobalFilter,
        want: "",
      },
      {
        name: "string array",
        queryValue: ["foo"],
        defaultValue: defaultDefaultGlobalFilter,
        want: "",
      },
      {
        name: "undefined",
        queryValue: undefined,
        defaultValue: defaultDefaultGlobalFilter,
        want: "",
      },
      {
        name: "encodedEmptyStringGlobalFilterForCustomDefaultValue",
        queryValue: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: defaultDefaultGlobalFilter,
        want: encodedEmptyStringGlobalFilterForCustomDefaultValue,
      },
      {
        name: "with custom default value: string",
        queryValue: "foo",
        defaultValue: customDefaultValue,
        want: "foo",
      },
      {
        name: "with custom default value: empty",
        queryValue: "",
        defaultValue: customDefaultValue,
        want: "",
      },
      {
        name: "with custom default value: default value",
        queryValue: customDefaultValue,
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: string array",
        queryValue: ["foo"],
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
        name: "with custom default value: encodedEmptyStringGlobalFilterForCustomDefaultValue",
        queryValue: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: customDefaultValue,
        want: "",
      },
    ])("$name", ({ queryValue, want, defaultValue }) =>
      expect(decodeGlobalFilter(queryValue, defaultValue)).toBe(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      globalFilter: Parameters<typeof encodeGlobalFilter>[0];
      defaultValue: Parameters<typeof encodeGlobalFilter>[1];
      wantDecoded?: ReturnType<typeof decodeGlobalFilter>;
    }>([
      {
        name: "empty string(default value)",
        globalFilter: "",
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "non-empty string",
        globalFilter: "foo",
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "encodedEmptyStringGlobalFilterForCustomDefaultValue",
        globalFilter: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: defaultDefaultGlobalFilter,
      },
      {
        name: "with custom default value: empty string",
        globalFilter: "",
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: non-empty string",
        globalFilter: "foo",
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: default value",
        globalFilter: customDefaultValue,
        defaultValue: customDefaultValue,
      },
      {
        name: "with custom default value: encodedEmptyStringGlobalFilterForCustomDefaultValue",
        globalFilter: encodedEmptyStringGlobalFilterForCustomDefaultValue,
        defaultValue: customDefaultValue,
        wantDecoded: "",
      },
    ])("$name", ({ globalFilter, defaultValue, wantDecoded }) =>
      expect(
        decodeGlobalFilter(
          encodeGlobalFilter(globalFilter, defaultValue),
          defaultValue,
        ),
      ).toBe(wantDecoded ?? globalFilter),
    ));
});
