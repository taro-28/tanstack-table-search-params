import type { State } from ".";
import type { Query } from "./types";

export const encodeGlobalFilter = (
	globalFilter: State["globalFilter"],
): string | undefined => {
	return typeof globalFilter === "string" && globalFilter !== ""
		? globalFilter
		: undefined;
};

export const decodeGlobalFilter = (globalFilter: Query[string]): string => {
	return typeof globalFilter === "string" ? globalFilter : "";
};
