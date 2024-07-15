import { describe, expect, test } from "vitest";
import { decodeGlobalFilter, encodeGlobalFilter } from "./globalFilter";

describe("encodeGlobalFilter", () => {
	test.each<{
		name: string;
		globalFilter: Parameters<typeof encodeGlobalFilter>[0];
		want: ReturnType<typeof encodeGlobalFilter>;
	}>([
		{
			name: "empty string",
			globalFilter: "",
			want: undefined,
		},
		{
			name: "non-empty string",
			globalFilter: "foo",
			want: "foo",
		},
	])("$name", ({ globalFilter, want }) => {
		expect(encodeGlobalFilter(globalFilter)).toBe(want);
	});
});

describe("decodeGlobalFilter", () => {
	test.each<{
		name: string;
		queryValue: Parameters<typeof decodeGlobalFilter>[0];
		want: ReturnType<typeof decodeGlobalFilter>;
	}>([
		{
			name: "string",
			queryValue: "foo",
			want: "foo",
		},
		{
			name: "non-string",
			queryValue: ["foo"],
			want: "",
		},
		{
			name: "undefined",
			queryValue: undefined,
			want: "",
		},
	])("$name", ({ queryValue, want }) => {
		expect(decodeGlobalFilter(queryValue)).toBe(want);
	});
});
