import { describe, expect, test } from "vitest";
import { defaultDefaultSorting } from "../useSorting";
import { noneStringForCustomDefaultValue } from "./noneStringForCustomDefaultValue";
import { decodeSorting, encodeSorting } from "./sorting";

const customDefaultValue = [
  {
    id: "custom",
    desc: true,
  },
];

describe("sorting", () => {
  describe("encode", () =>
    describe.each<{
      name: string;
      defaultValue: NonNullable<
        Parameters<typeof encodeSorting>[1]
      >["defaultValue"];
    }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeSorting>[0];
        want: ReturnType<typeof encodeSorting>;
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
            JSON.stringify(defaultDefaultSorting)
              ? undefined
              : noneStringForCustomDefaultValue,
        },
        {
          name: "non-empty array",
          stateValue: [{ id: "foo", desc: true }],
          want: "foo.desc",
        },
        {
          name: "multiple items",
          stateValue: [
            { id: "foo", desc: true },
            { id: "bar", desc: false },
          ],
          want: "foo.desc,bar.asc",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeSorting(stateValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{
      name: string;
      defaultValue: NonNullable<
        Parameters<typeof decodeSorting>[1]
      >["defaultValue"];
    }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        queryValue: Parameters<typeof decodeSorting>[0];
        want: ReturnType<typeof decodeSorting>;
      }>([
        {
          name: "default value",
          queryValue: encodeSorting(defaultValue, { defaultValue }),
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
          name: "string",
          queryValue: "foo.desc",
          want: [{ id: "foo", desc: true }],
        },
        {
          name: "string array",
          queryValue: ["foo.desc"],
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
          name: "invalid order",
          queryValue: "foo.bar",
          want: defaultValue,
        },
      ])("$name", ({ queryValue, want }) =>
        expect(decodeSorting(queryValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{
      name: string;
      defaultValue: NonNullable<
        Parameters<typeof encodeSorting>[1]
      >["defaultValue"];
    }>([
      {
        name: "default default value",
        defaultValue: defaultDefaultSorting,
      },
      {
        name: "with custom default value",
        defaultValue: customDefaultValue,
      },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeSorting>[0];
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
          name: "non-empty array",
          stateValue: [{ id: "foo", desc: true }],
        },
        {
          name: "multiple items",
          stateValue: [
            { id: "foo", desc: true },
            { id: "bar", desc: false },
          ],
        },
      ])("$name", ({ stateValue }) => {
        expect(
          decodeSorting(encodeSorting(stateValue, { defaultValue }), {
            defaultValue,
          }),
        ).toEqual(stateValue);
      }),
    ));
});
