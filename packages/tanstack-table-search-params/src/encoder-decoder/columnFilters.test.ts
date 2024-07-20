import { describe, expect, test } from "vitest";
import { decodeColumnFilters, encodeColumnFilters } from "./columnFilters";

describe("columnFilters", () => {
  describe("encode", () =>
    test.each<{
      name: string;
      columnFilters: Parameters<typeof encodeColumnFilters>[0];
      want: ReturnType<typeof encodeColumnFilters>;
    }>([
      {
        name: "empty array",
        columnFilters: [],
        want: undefined,
      },
      {
        name: "string value",
        columnFilters: [{ id: "foo", value: "bar" }],
        want: "foo.%22bar%22",
      },
      {
        name: "number value",
        columnFilters: [{ id: "foo", value: 42 }],
        want: "foo.42",
      },
      {
        name: "boolean value",
        columnFilters: [{ id: "foo", value: true }],
        want: "foo.true",
      },
      {
        name: "null value",
        columnFilters: [{ id: "foo", value: null }],
        want: "foo.null",
      },
      {
        name: "undefined value",
        columnFilters: [{ id: "foo", value: undefined }],
        want: "foo.undefined",
      },
      {
        name: "empty object value",
        columnFilters: [{ id: "foo", value: {} }],
        want: "foo.%7B%7D",
      },
      {
        name: "string object value",
        columnFilters: [{ id: "foo", value: { bar: "baz" } }],
        want: "foo.%7B%22bar%22%3A%22baz%22%7D",
      },
      {
        name: "number object value",
        columnFilters: [{ id: "foo", value: { bar: 42 } }],
        want: "foo.%7B%22bar%22%3A42%7D",
      },
      {
        name: "boolean object value",
        columnFilters: [{ id: "foo", value: { bar: true } }],
        want: "foo.%7B%22bar%22%3Atrue%7D",
      },
      {
        name: "null object value",
        columnFilters: [{ id: "foo", value: { bar: null } }],
        want: "foo.%7B%22bar%22%3Anull%7D",
      },
      {
        name: "undefined object value",
        columnFilters: [{ id: "foo", value: { bar: undefined } }],
        want: "foo.%7B%7D",
      },
      {
        name: "array object value",
        columnFilters: [{ id: "foo", value: { bar: ["baz"] } }],
        want: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
      },
      {
        name: "object object value",
        columnFilters: [{ id: "foo", value: { bar: { baz: "qux" } } }],
        want: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
      },
      {
        name: "mixed object value",
        columnFilters: [
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
        want: "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
      },
      {
        name: "empty array value",
        columnFilters: [{ id: "foo", value: [] }],
        want: "foo.%5B%5D",
      },
      {
        name: "string array value",
        columnFilters: [{ id: "foo", value: ["bar", "baz"] }],
        want: "foo.%5B%22bar%22%2C%22baz%22%5D",
      },
      {
        name: "number array value",
        columnFilters: [{ id: "foo", value: [42, 43] }],
        want: "foo.%5B42%2C43%5D",
      },
      {
        name: "boolean array value",
        columnFilters: [{ id: "foo", value: [true, false] }],
        want: "foo.%5Btrue%2Cfalse%5D",
      },
      {
        name: "null array value",
        columnFilters: [{ id: "foo", value: [null, null] }],
        want: "foo.%5Bnull%2Cnull%5D",
      },
      {
        name: "object array value",
        columnFilters: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
        want: "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
      },
      {
        name: "array array value",
        columnFilters: [{ id: "foo", value: [["bar"], ["baz"]] }],
        want: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
      },
      {
        name: "mixed array value",
        columnFilters: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
        want: "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
      },
    ])("$name", ({ columnFilters, want }) =>
      expect(encodeColumnFilters(columnFilters)).toEqual(want),
    ));

  describe("decode", () =>
    test.each<{
      name: string;
      queryValue: Parameters<typeof decodeColumnFilters>[0];
      want: ReturnType<typeof decodeColumnFilters>;
    }>([
      {
        name: "empty array",
        queryValue: "",
        want: [],
      },
      {
        name: "string value",
        queryValue: "foo.%22bar%22",
        want: [{ id: "foo", value: "bar" }],
      },
      {
        name: "number value",
        queryValue: "foo.42",
        want: [{ id: "foo", value: 42 }],
      },
      {
        name: "boolean value",
        queryValue: "foo.true",
        want: [{ id: "foo", value: true }],
      },
      {
        name: "null value",
        queryValue: "foo.null",
        want: [{ id: "foo", value: null }],
      },
      {
        name: "undefined value",
        queryValue: "foo.undefined",
        want: [{ id: "foo", value: undefined }],
      },
      {
        name: "empty object value",
        queryValue: "foo.%7B%7D",
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "string object value",
        queryValue: "foo.%7B%22bar%22%3A%22baz%22%7D",
        want: [{ id: "foo", value: { bar: "baz" } }],
      },
      {
        name: "number object value",
        queryValue: "foo.%7B%22bar%22%3A42%7D",
        want: [{ id: "foo", value: { bar: 42 } }],
      },
      {
        name: "boolean object value",
        queryValue: "foo.%7B%22bar%22%3Atrue%7D",
        want: [{ id: "foo", value: { bar: true } }],
      },
      {
        name: "null object value",
        queryValue: "foo.%7B%22bar%22%3Anull%7D",
        want: [{ id: "foo", value: { bar: null } }],
      },
      {
        name: "undefined object value",
        queryValue: "foo.%7B%7D",
        want: [{ id: "foo", value: {} }],
      },
      {
        name: "array object value",
        queryValue: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
        want: [{ id: "foo", value: { bar: ["baz"] } }],
      },
      {
        name: "object object value",
        queryValue: "foo.%7B%22bar%22%3A%7B%22baz%22%3A%22qux%22%7D%7D",
        want: [{ id: "foo", value: { bar: { baz: "qux" } } }],
      },
      {
        name: "mixed object value",
        queryValue:
          "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
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
        want: [{ id: "foo", value: [] }],
      },
      {
        name: "string array value",
        queryValue: "foo.%5B%22bar%22%2C%22baz%22%5D",
        want: [{ id: "foo", value: ["bar", "baz"] }],
      },
      {
        name: "number array value",
        queryValue: "foo.%5B42%2C43%5D",
        want: [{ id: "foo", value: [42, 43] }],
      },
      {
        name: "boolean array value",
        queryValue: "foo.%5Btrue%2Cfalse%5D",
        want: [{ id: "foo", value: [true, false] }],
      },
      {
        name: "null array value",
        queryValue: "foo.%5Bnull%2Cnull%5D",
        want: [{ id: "foo", value: [null, null] }],
      },
      {
        name: "object array value",
        queryValue:
          "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
        want: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
      },
      {
        name: "array array value",
        queryValue: "foo.%5B%5B%22bar%22%5D%2C%5B%22baz%22%5D%5D",
        want: [{ id: "foo", value: [["bar"], ["baz"]] }],
      },
      {
        name: "mixed array value",
        queryValue:
          "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
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
        want: [],
      },
      {
        name: "undefined",
        queryValue: undefined,
        want: [],
      },
      {
        name: "empty string",
        queryValue: "",
        want: [],
      },
      {
        name: "invalid string",
        queryValue: "foo",
        want: [],
      },
      {
        name: "invalid value",
        queryValue: "foo.bar",
        want: [],
      },
    ])("$name", ({ queryValue, want }) =>
      expect(decodeColumnFilters(queryValue)).toEqual(want),
    ));

  describe("encode and decode", () =>
    test.each<{
      name: string;
      columnFilters: Parameters<typeof encodeColumnFilters>[0];
    }>([
      {
        name: "empty array",
        columnFilters: [],
      },
      {
        name: "string value",
        columnFilters: [{ id: "foo", value: "bar" }],
      },
      {
        name: "number value",
        columnFilters: [{ id: "foo", value: 42 }],
      },
      {
        name: "boolean value",
        columnFilters: [{ id: "foo", value: true }],
      },
      {
        name: "null value",
        columnFilters: [{ id: "foo", value: null }],
      },
      {
        name: "undefined value",
        columnFilters: [{ id: "foo", value: undefined }],
      },
      {
        name: "empty object value",
        columnFilters: [{ id: "foo", value: {} }],
      },
      {
        name: "string object value",
        columnFilters: [{ id: "foo", value: { bar: "baz" } }],
      },
      {
        name: "number object value",
        columnFilters: [{ id: "foo", value: { bar: 42 } }],
      },
      {
        name: "boolean object value",
        columnFilters: [{ id: "foo", value: { bar: true } }],
      },
      {
        name: "null object value",
        columnFilters: [{ id: "foo", value: { bar: null } }],
      },
      {
        name: "undefined object value",
        columnFilters: [{ id: "foo", value: { bar: undefined } }],
      },
      {
        name: "array object value",
        columnFilters: [{ id: "foo", value: { bar: ["baz"] } }],
      },
      {
        name: "object object value",
        columnFilters: [{ id: "foo", value: { bar: { baz: "qux" } } }],
      },
      {
        name: "mixed object value",
        columnFilters: [
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
        columnFilters: [{ id: "foo", value: [] }],
      },
      {
        name: "string array value",
        columnFilters: [{ id: "foo", value: ["bar", "baz"] }],
      },
      {
        name: "number array value",
        columnFilters: [{ id: "foo", value: [42, 43] }],
      },
      {
        name: "boolean array value",
        columnFilters: [{ id: "foo", value: [true, false] }],
      },
      {
        name: "null array value",
        columnFilters: [{ id: "foo", value: [null, null] }],
      },
      {
        name: "object array value",
        columnFilters: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
      },
      {
        name: "array array value",
        columnFilters: [{ id: "foo", value: [["bar"], ["baz"]] }],
      },
      {
        name: "mixed array value",
        columnFilters: [
          {
            id: "foo",
            value: ["bar", 42, true, null, { bar: "baz" }, ["qux"]],
          },
        ],
      },
    ])("$name", ({ columnFilters }) => {
      expect(decodeColumnFilters(encodeColumnFilters(columnFilters))).toEqual(
        columnFilters,
      );
    }));
});
