import { describe, expect, test } from "vitest";
import { decodeColumnFilters, encodeColumnFilters } from "./columnFilters";
import { defaultDefaultColumnFilters } from "../useColumnFilters";
import { encodedEmptyStringForCustomDefaultValue } from "./encodedEmptyStringForCustomDefaultValue";

const customDefaultValue = [
  {
    id: "custom",
    value: "default",
  },
];

describe("columnFilters", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      stateValue: Parameters<typeof encodeColumnFilters>[0];
      defaultValue: Parameters<typeof encodeColumnFilters>[1];
      want: ReturnType<typeof encodeColumnFilters>;
    }>([
      {
        name: "empty array(default value)",
        stateValue: [],
        defaultValue: defaultDefaultColumnFilters,
        want: undefined,
      },
      {
        name: "string value",
        stateValue: [{ id: "foo", value: "bar" }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%22bar%22",
      },
      {
        name: "number value",
        stateValue: [{ id: "foo", value: 42 }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.42",
      },
      {
        name: "boolean value",
        stateValue: [{ id: "foo", value: true }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.true",
      },
      {
        name: "null value",
        stateValue: [{ id: "foo", value: null }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.null",
      },
      {
        name: "undefined value",
        stateValue: [{ id: "foo", value: undefined }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.undefined",
      },
      {
        name: "empty object value",
        stateValue: [{ id: "foo", value: {} }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%7D",
      },
      {
        name: "string object value",
        stateValue: [{ id: "foo", value: { bar: "baz" } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3A%22baz%22%7D",
      },
      {
        name: "number object value",
        stateValue: [{ id: "foo", value: { bar: 42 } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3A42%7D",
      },
      {
        name: "boolean object value",
        stateValue: [{ id: "foo", value: { bar: true } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3Atrue%7D",
      },
      {
        name: "null object value",
        stateValue: [{ id: "foo", value: { bar: null } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3Anull%7D",
      },
      {
        name: "undefined object value",
        stateValue: [{ id: "foo", value: { bar: undefined } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%7D",
      },
      {
        name: "array object value",
        stateValue: [{ id: "foo", value: { bar: ["baz"] } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
      },
      {
        name: "object object value",
        stateValue: [{ id: "foo", value: { bar: { baz: "qux" } } }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
      },
      {
        name: "mixed object value",
        stateValue: [
          {
            id: "foo",
            value: {
              string: "baz",
              number: 42,
              boolean: true,
              null: null,
              undefined: undefined,
              object: { garply: "waldo" },
              array: ["aaa", "bbb"],
            },
          },
        ],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
      },
      {
        name: "empty array value",
        stateValue: [{ id: "foo", value: [] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B%5D",
      },
      {
        name: "string array value",
        stateValue: [{ id: "foo", value: ["bar", "baz"] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B%22bar%22%2C%22baz%22%5D",
      },
      {
        name: "number array value",
        stateValue: [{ id: "foo", value: [42, 43] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B42%2C43%5D",
      },
      {
        name: "boolean array value",
        stateValue: [{ id: "foo", value: [true, false] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5Btrue%2Cfalse%5D",
      },
      {
        name: "null array value",
        stateValue: [{ id: "foo", value: [null, null] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5Bnull%2Cnull%5D",
      },
      {
        name: "object array value",
        stateValue: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
      },
      {
        name: "array array value",
        stateValue: [{ id: "foo", value: [["bar"], ["baz"]] }],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
      },
      {
        name: "mixed array value",
        stateValue: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
        defaultValue: defaultDefaultColumnFilters,
        want: "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
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
        name: "with custom default value: string value",
        stateValue: [{ id: "foo", value: "bar" }],
        defaultValue: customDefaultValue,
        want: "foo.%22bar%22",
      },
      {
        name: "with custom default value: number value",
        stateValue: [{ id: "foo", value: 42 }],
        defaultValue: customDefaultValue,
        want: "foo.42",
      },
      {
        name: "with custom default value: boolean value",
        stateValue: [{ id: "foo", value: true }],
        defaultValue: customDefaultValue,
        want: "foo.true",
      },
      {
        name: "with custom default value: null value",
        stateValue: [{ id: "foo", value: null }],
        defaultValue: customDefaultValue,
        want: "foo.null",
      },
      {
        name: "with custom default value: undefined value",
        stateValue: [{ id: "foo", value: undefined }],
        defaultValue: customDefaultValue,
        want: "foo.undefined",
      },
      {
        name: "with custom default value: empty object value",
        stateValue: [{ id: "foo", value: {} }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%7D",
      },
      {
        name: "with custom default value: string object value",
        stateValue: [{ id: "foo", value: { bar: "baz" } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3A%22baz%22%7D",
      },
      {
        name: "with custom default value: number object value",
        stateValue: [{ id: "foo", value: { bar: 42 } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3A42%7D",
      },
      {
        name: "with custom default value: boolean object value",
        stateValue: [{ id: "foo", value: { bar: true } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3Atrue%7D",
      },
      {
        name: "with custom default value: null object value",
        stateValue: [{ id: "foo", value: { bar: null } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3Anull%7D",
      },
      {
        name: "with custom default value: undefined object value",
        stateValue: [{ id: "foo", value: { bar: undefined } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%7D",
      },
      {
        name: "with custom default value: array object value",
        stateValue: [{ id: "foo", value: { bar: ["baz"] } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
      },
      {
        name: "with custom default value: object object value",
        stateValue: [{ id: "foo", value: { bar: { baz: "qux" } } }],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
      },
      {
        name: "with custom default value: mixed object value",
        stateValue: [
          {
            id: "foo",
            value: {
              string: "baz",
              number: 42,
              boolean: true,
              null: null,
              undefined: undefined,
              object: { garply: "waldo" },
              array: ["aaa", "bbb"],
            },
          },
        ],
        defaultValue: customDefaultValue,
        want: "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
      },
      {
        name: "with custom default value: empty array value",
        stateValue: [{ id: "foo", value: [] }],
        defaultValue: customDefaultValue,
        want: "foo.%5B%5D",
      },
      {
        name: "with custom default value: string array value",
        stateValue: [{ id: "foo", value: ["bar", "baz"] }],
        defaultValue: customDefaultValue,
        want: "foo.%5B%22bar%22%2C%22baz%22%5D",
      },
      {
        name: "with custom default value: number array value",
        stateValue: [{ id: "foo", value: [42, 43] }],
        defaultValue: customDefaultValue,
        want: "foo.%5B42%2C43%5D",
      },
      {
        name: "with custom default value: boolean array value",
        stateValue: [{ id: "foo", value: [true, false] }],
        defaultValue: customDefaultValue,
        want: "foo.%5Btrue%2Cfalse%5D",
      },
      {
        name: "with custom default value: null array value",
        stateValue: [{ id: "foo", value: [null, null] }],
        defaultValue: customDefaultValue,
        want: "foo.%5Bnull%2Cnull%5D",
      },
      {
        name: "with custom default value: object array value",
        stateValue: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
        defaultValue: customDefaultValue,
        want: "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
      },
      {
        name: "with custom default value: array array value",
        stateValue: [{ id: "foo", value: [["bar"], ["baz"]] }],
        defaultValue: customDefaultValue,
        want: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
      },
      {
        name: "with custom default value: mixed array value",
        stateValue: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
        defaultValue: customDefaultValue,
        want: "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
      },
    ])("$name", ({ stateValue, defaultValue, want }) =>
      expect(encodeColumnFilters(stateValue, defaultValue)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeColumnFilters>[0];
      defaultValue: Parameters<typeof decodeColumnFilters>[1];
      want: ReturnType<typeof decodeColumnFilters>;
    }>([
      {
        name: "empty string",
        queryValue: "",
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "encodedEmptyStringForCustomDefaultValue",
        queryValue: encodedEmptyStringForCustomDefaultValue,
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "string value",
        queryValue: "foo.%22bar%22",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: "bar" }],
      },
      {
        name: "number value",
        queryValue: "foo.42",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: 42 }],
      },
      {
        name: "boolean value",
        queryValue: "foo.true",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: true }],
      },
      {
        name: "null value",
        queryValue: "foo.null",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: null }],
      },
      {
        name: "undefined value",
        queryValue: "foo.undefined",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: undefined }],
      },
      {
        name: "empty object value",
        queryValue: "foo.%7B%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "string object value",
        queryValue: "foo.%7B%22bar%22%3A%22baz%22%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: "baz" } }],
      },
      {
        name: "number object value",
        queryValue: "foo.%7B%22bar%22%3A42%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: 42 } }],
      },
      {
        name: "boolean object value",
        queryValue: "foo.%7B%22bar%22%3Atrue%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: true } }],
      },
      {
        name: "null object value",
        queryValue: "foo.%7B%22bar%22%3Anull%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: null } }],
      },
      {
        name: "undefined object value",
        queryValue: "foo.%7B%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "array object value",
        queryValue: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: ["baz"] } }],
      },
      {
        name: "object object value",
        queryValue: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: { bar: { baz: "qux" } } }],
      },
      {
        name: "mixed object value",
        queryValue:
          "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
        defaultValue: defaultDefaultColumnFilters,
        want: [
          {
            id: "foo",
            value: {
              string: "baz",
              number: 42,
              boolean: true,
              null: null,
              object: { garply: "waldo" },
              array: ["aaa", "bbb"],
            },
          },
        ],
      },
      {
        name: "empty array value",
        queryValue: "foo.%5B%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [] }],
      },
      {
        name: "string array value",
        queryValue: "foo.%5B%22bar%22%2C%22baz%22%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: ["bar", "baz"] }],
      },
      {
        name: "number array value",
        queryValue: "foo.%5B42%2C43%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [42, 43] }],
      },
      {
        name: "boolean array value",
        queryValue: "foo.%5Btrue%2Cfalse%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [true, false] }],
      },
      {
        name: "null array value",
        queryValue: "foo.%5Bnull%2Cnull%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [null, null] }],
      },
      {
        name: "object array value",
        queryValue:
          "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
      },
      {
        name: "array array value",
        queryValue: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [{ id: "foo", value: [["bar"], ["baz"]] }],
      },
      {
        name: "mixed array value",
        queryValue:
          "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
        defaultValue: defaultDefaultColumnFilters,
        want: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
      },
      {
        name: "invalid string array",
        queryValue: ["invalid"],
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "undefined",
        queryValue: undefined,
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "invalid string",
        queryValue: "foo",
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "invalid value",
        queryValue: "foo.bar",
        defaultValue: defaultDefaultColumnFilters,
        want: [],
      },
      {
        name: "with custom default value: empty string",
        queryValue: "",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: default value",
        queryValue: `${customDefaultValue[0]?.id}.${encodeURIComponent(JSON.stringify(customDefaultValue[0]?.value))}`,
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
        name: "with custom default value: string value",
        queryValue: "foo.%22bar%22",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: "bar" }],
      },
      {
        name: "with custom default value: number value",
        queryValue: "foo.42",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: 42 }],
      },
      {
        name: "with custom default value: boolean value",
        queryValue: "foo.true",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: true }],
      },
      {
        name: "with custom default value: null value",
        queryValue: "foo.null",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: null }],
      },
      {
        name: "with custom default value: undefined value",
        queryValue: "foo.undefined",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: undefined }],
      },
      {
        name: "with custom default value: empty object value",
        queryValue: "foo.%7B%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "with custom default value: string object value",
        queryValue: "foo.%7B%22bar%22%3A%22baz%22%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: "baz" } }],
      },
      {
        name: "with custom default value: number object value",
        queryValue: "foo.%7B%22bar%22%3A42%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: 42 } }],
      },
      {
        name: "with custom default value: boolean object value",
        queryValue: "foo.%7B%22bar%22%3Atrue%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: true } }],
      },
      {
        name: "with custom default value: null object value",
        queryValue: "foo.%7B%22bar%22%3Anull%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: null } }],
      },
      {
        name: "with custom default value: undefined object value",
        queryValue: "foo.%7B%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "with custom default value: array object value",
        queryValue: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: ["baz"] } }],
      },
      {
        name: "with custom default value: object object value",
        queryValue: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: { bar: { baz: "qux" } } }],
      },
      {
        name: "with custom default value: mixed object value",
        queryValue:
          "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
        defaultValue: customDefaultValue,
        want: [
          {
            id: "foo",
            value: {
              string: "baz",
              number: 42,
              boolean: true,
              null: null,
              object: { garply: "waldo" },
              array: ["aaa", "bbb"],
            },
          },
        ],
      },
      {
        name: "with custom default value: empty array value",
        queryValue: "foo.%5B%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [] }],
      },
      {
        name: "with custom default value: string array value",
        queryValue: "foo.%5B%22bar%22%2C%22baz%22%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: ["bar", "baz"] }],
      },
      {
        name: "with custom default value: number array value",
        queryValue: "foo.%5B42%2C43%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [42, 43] }],
      },
      {
        name: "with custom default value: boolean array value",
        queryValue: "foo.%5Btrue%2Cfalse%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [true, false] }],
      },
      {
        name: "with custom default value: null array value",
        queryValue: "foo.%5Bnull%2Cnull%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [null, null] }],
      },
      {
        name: "with custom default value: object array value",
        queryValue:
          "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
      },
      {
        name: "with custom default value: array array value",
        queryValue: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
        defaultValue: customDefaultValue,
        want: [{ id: "foo", value: [["bar"], ["baz"]] }],
      },
      {
        name: "with custom default value: mixed array value",
        queryValue:
          "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
        defaultValue: customDefaultValue,
        want: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
      },
      {
        name: "with custom default value: invalid string array",
        queryValue: ["invalid"],
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
        name: "with custom default value: invalid string",
        queryValue: "foo",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
      {
        name: "with custom default value: invalid value",
        queryValue: "foo.bar",
        defaultValue: customDefaultValue,
        want: customDefaultValue,
      },
    ])("$name", ({ queryValue, defaultValue, want }) =>
      expect(decodeColumnFilters(queryValue, defaultValue)).toEqual(want),
    ));

  describe("encode and decode", () =>
    describe.each<Parameters<typeof encodeColumnFilters>[1]>([
      defaultDefaultColumnFilters,
      customDefaultValue,
    ])("default value: $defaultValue", (...defaultValue) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnFilters>[1];
      }>([
        {
          name: "default value",
          stateValue: defaultValue,
        },
        {
          name: "string value",
          stateValue: [{ id: "foo", value: "bar" }],
        },
        {
          name: "number value",
          stateValue: [{ id: "foo", value: 42 }],
        },
        {
          name: "boolean value",
          stateValue: [{ id: "foo", value: true }],
        },
        {
          name: "null value",
          stateValue: [{ id: "foo", value: null }],
        },
        {
          name: "undefined value",
          stateValue: [{ id: "foo", value: undefined }],
        },
        {
          name: "empty object value",
          stateValue: [{ id: "foo", value: {} }],
        },
        {
          name: "string object value",
          stateValue: [{ id: "foo", value: { bar: "baz" } }],
        },
        {
          name: "number object value",
          stateValue: [{ id: "foo", value: { bar: 42 } }],
        },
        {
          name: "boolean object value",
          stateValue: [{ id: "foo", value: { bar: true } }],
        },
        {
          name: "null object value",
          stateValue: [{ id: "foo", value: { bar: null } }],
        },
        {
          name: "undefined object value",
          stateValue: [{ id: "foo", value: { bar: undefined } }],
        },
        {
          name: "array object value",
          stateValue: [{ id: "foo", value: { bar: ["baz"] } }],
        },
        {
          name: "object object value",
          stateValue: [{ id: "foo", value: { bar: { baz: "qux" } } }],
        },
        {
          name: "mixed object value",
          stateValue: [
            {
              id: "foo",
              value: {
                string: "baz",
                number: 42,
                boolean: true,
                null: null,
                undefined: undefined,
                object: { garply: "waldo" },
                array: ["aaa", "bbb"],
              },
            },
          ],
        },
        {
          name: "empty array value",
          stateValue: [{ id: "foo", value: [] }],
        },
        {
          name: "string array value",
          stateValue: [{ id: "foo", value: ["bar", "baz"] }],
        },
        {
          name: "number array value",
          stateValue: [{ id: "foo", value: [42, 43] }],
        },
        {
          name: "boolean array value",
          stateValue: [{ id: "foo", value: [true, false] }],
        },
        {
          name: "null array value",
          stateValue: [{ id: "foo", value: [null, null] }],
        },
        {
          name: "object array value",
          stateValue: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
        },
        {
          name: "array array value",
          stateValue: [{ id: "foo", value: [["bar"], ["baz"]] }],
        },
        {
          name: "mixed array value",
          stateValue: [
            {
              id: "foo",
              value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
            },
          ],
        },
      ])("$name", ({ stateValue }) => {
        expect(
          decodeColumnFilters(
            encodeColumnFilters(stateValue, defaultValue),
            defaultValue,
          ),
        ).toEqual(stateValue);
      }),
    ));
});
