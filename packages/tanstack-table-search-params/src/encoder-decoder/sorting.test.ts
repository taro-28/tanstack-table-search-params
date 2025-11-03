import { describe, expect, test } from "vitest";
import { noneStringForCustomDefaultValue } from "./consts";
import { decodeSorting, defaultDefaultSorting, encodeSorting } from "./sorting";

type DefaultValue = NonNullable<
  NonNullable<Parameters<typeof encodeSorting>[1]>["defaultValue"]
>;

const customDefaultValue = [{ id: "custom", desc: true }];

describe("sorting", () => {
  describe("encode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      { name: "default default value", defaultValue: defaultDefaultSorting },
      { name: "with custom default value", defaultValue: customDefaultValue },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeSorting>[0];
        want: ReturnType<typeof encodeSorting>;
      }>([
        { name: "default value", stateValue: defaultValue, want: undefined },
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
        {
          name: "column ID with comma",
          stateValue: [{ id: "user,data", desc: true }],
          want: "user%2Cdata.desc",
        },
        {
          name: "column ID with period",
          stateValue: [{ id: "user.name", desc: false }],
          want: "user%2Ename.asc",
        },
        {
          name: "column ID with comma and period",
          stateValue: [{ id: "a.b,c", desc: true }],
          want: "a%2Eb%2Cc.desc",
        },
        {
          name: "multiple sorts with delimiter in IDs",
          stateValue: [
            { id: "user.name", desc: true },
            { id: "user,age", desc: false },
          ],
          want: "user%2Ename.desc,user%2Cage.asc",
        },
      ])("$name", ({ stateValue, want }) =>
        expect(encodeSorting(stateValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      { name: "default default value", defaultValue: defaultDefaultSorting },
      { name: "with custom default value", defaultValue: customDefaultValue },
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
        { name: "empty string", queryValue: "", want: defaultValue },
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
          name: "column ID with comma",
          queryValue: "user%2Cdata.desc",
          want: [{ id: "user,data", desc: true }],
        },
        {
          name: "column ID with period",
          queryValue: "user%2Ename.asc",
          want: [{ id: "user.name", desc: false }],
        },
        {
          name: "column ID with comma and period",
          queryValue: "a%2Eb%2Cc.desc",
          want: [{ id: "a.b,c", desc: true }],
        },
        {
          name: "multiple sorts with delimiter in IDs",
          queryValue: "user%2Ename.desc,user%2Cage.asc",
          want: [
            { id: "user.name", desc: true },
            { id: "user,age", desc: false },
          ],
        },
        { name: "string array", queryValue: ["foo.desc"], want: defaultValue },
        { name: "undefined", queryValue: undefined, want: defaultValue },
        { name: "invalid string", queryValue: "foo", want: defaultValue },
        { name: "invalid order", queryValue: "foo.bar", want: defaultValue },
      ])("$name", ({ queryValue, want }) =>
        expect(decodeSorting(queryValue, { defaultValue })).toEqual(want),
      ),
    ));

  describe("encode and decode", () =>
    describe.each<{ name: string; defaultValue: DefaultValue }>([
      { name: "default default value", defaultValue: defaultDefaultSorting },
      { name: "with custom default value", defaultValue: customDefaultValue },
    ])("default value: $name", ({ defaultValue }) =>
      test.each<{
        name: string;
        stateValue: Parameters<typeof encodeSorting>[0];
      }>([
        { name: "default value", stateValue: defaultValue },
        { name: "empty array", stateValue: [] },
        { name: "non-empty array", stateValue: [{ id: "foo", desc: true }] },
        {
          name: "multiple items",
          stateValue: [
            { id: "foo", desc: true },
            { id: "bar", desc: false },
          ],
        },
        {
          name: "column ID with comma",
          stateValue: [{ id: "user,data", desc: true }],
        },
        {
          name: "column ID with period",
          stateValue: [{ id: "user.name", desc: false }],
        },
        {
          name: "column ID with comma and period",
          stateValue: [{ id: "a.b,c", desc: true }],
        },
        {
          name: "multiple sorts with delimiter in IDs",
          stateValue: [
            { id: "user.name", desc: true },
            { id: "user,age", desc: false },
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
