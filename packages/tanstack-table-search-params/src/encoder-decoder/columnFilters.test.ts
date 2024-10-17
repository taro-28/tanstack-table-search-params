import { describe, expect, test } from "vitest";
import { defaultDefaultColumnFilters } from "../useColumnFilters";
import { decodeColumnFilters, encodeColumnFilters } from "./columnFilters";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";

const customDefaultValue = [
  {
    id: "custom",
    value: "default",
  },
];

describe("columnFilters", () => {
  describe("encode", () =>
    describe.each<Parameters<typeof encodeColumnFilters>[1]>([
      defaultDefaultColumnFilters,
      customDefaultValue,
    ])("default value: %defaultValue", (...defaultValue) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeColumnFilters>[0];
        want: ReturnType<typeof encodeColumnFilters>;
      }>([
        {
          name: "default value",
          stateValue: defaultValue,
          want: undefined,
        },
        {
          name: "empty array",
          stateValue: [],
          want:
            JSON.stringify(defaultValue) ===
            JSON.stringify(defaultDefaultColumnFilters)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        {
          name: "string value",
          stateValue: [{ id: "foo", value: "bar" }],
          want: "foo.%22bar%22",
        },
        {
          name: "number value",
          stateValue: [{ id: "foo", value: 42 }],
          want: "foo.42",
        },
        {
          name: "boolean value",
          stateValue: [{ id: "foo", value: true }],
          want: "foo.true",
        },
        {
          name: "null value",
          stateValue: [{ id: "foo", value: null }],
          want: "foo.null",
        },
        {
          name: "undefined value",
          stateValue: [{ id: "foo", value: undefined }],
          want: "foo.undefined",
        },
        {
          name: "empty object value",
          stateValue: [{ id: "foo", value: {} }],
          want: "foo.%7B%7D",
        },
        {
          name: "string object value",
          stateValue: [{ id: "foo", value: { bar: "baz" } }],
          want: "foo.%7B%22bar%22%3A%22baz%22%7D",
        },
        {
          name: "number object value",
          stateValue: [{ id: "foo", value: { bar: 42 } }],
          want: "foo.%7B%22bar%22%3A42%7D",
        },
        {
          name: "boolean object value",
          stateValue: [{ id: "foo", value: { bar: true } }],
          want: "foo.%7B%22bar%22%3Atrue%7D",
        },
        {
          name: "null object value",
          stateValue: [{ id: "foo", value: { bar: null } }],
          want: "foo.%7B%22bar%22%3Anull%7D",
        },
        {
          name: "undefined object value",
          stateValue: [{ id: "foo", value: { bar: undefined } }],
          want: "foo.%7B%7D",
        },
        {
          name: "array object value",
          stateValue: [{ id: "foo", value: { bar: ["baz"] } }],
          want: "foo.%7B%22bar%22%3A%5B%22baz%22%5D%7D",
        },
        {
          name: "object object value",
          stateValue: [{ id: "foo", value: { bar: { baz: "qux" } } }],
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
          want: "foo.%7B%22string%22%3A%22baz%22%2C%22number%22%3A42%2C%22boolean%22%3Atrue%2C%22null%22%3Anull%2C%22object%22%3A%7B%22garply%22%3A%22waldo%22%7D%2C%22array%22%3A%5B%22aaa%22%2C%22bbb%22%5D%7D",
        },
        {
          name: "empty array value",
          stateValue: [{ id: "foo", value: [] }],
          want: "foo.%5B%5D",
        },
        {
          name: "string array value",
          stateValue: [{ id: "foo", value: ["bar", "baz"] }],
          want: "foo.%5B%22bar%22%2C%22baz%22%5D",
        },
        {
          name: "number array value",
          stateValue: [{ id: "foo", value: [42, 43] }],
          want: "foo.%5B42%2C43%5D",
        },
        {
          name: "boolean array value",
          stateValue: [{ id: "foo", value: [true, false] }],
          want: "foo.%5Btrue%2Cfalse%5D",
        },
        {
          name: "null array value",
          stateValue: [{ id: "foo", value: [null, null] }],
          want: "foo.%5Bnull%2Cnull%5D",
        },
        {
          name: "object array value",
          stateValue: [{ id: "foo", value: [{ bar: "baz" }, { bar: "qux" }] }],
          want: "foo.%5B%7B%22bar%22%3A%22baz%22%7D%2C%7B%22bar%22%3A%22qux%22%7D%5D",
        },
        {
          name: "array array value",
          stateValue: [{ id: "foo", value: [["bar"], ["baz"]] }],
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
          want: "foo.%5B%22bar%22%2C42%2Ctrue%2Cnull%2C%7B%22bar%22%3A%22baz%22%7D%2C%5B%22qux%22%5D%5D",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeColumnFilters(stateValue, defaultValue)).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each([defaultDefaultColumnFilters, customDefaultValue])(
      "default value: %defaultValue",
      (...defaultValue) =>
        test.each<{
          name: string;
          queryValue: Parameters<typeof decodeColumnFilters>[0];
          want: ReturnType<typeof decodeColumnFilters>;
        }>([
          {
            name: "default value",
            queryValue: encodeColumnFilters(defaultValue, defaultValue),
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
            want: defaultValue,
          },
          {
            name: "undefined",
            queryValue: undefined,
            want: defaultValue,
          },
          {
            name: "invalid string",
            queryValue: "foo",
            want: defaultValue,
          },
          {
            name: "invalid value",
            queryValue: "foo.bar",
            want: defaultValue,
          },
        ])("$name", ({ queryValue, want }) =>
          expect(decodeColumnFilters(queryValue, defaultValue)).toEqual(want),
        ),
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
          name: "empty array",
          stateValue: [],
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
