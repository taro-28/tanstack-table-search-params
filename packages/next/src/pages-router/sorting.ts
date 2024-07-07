import invariant from "ts-invariant";
import type { State } from ".";
import type { Query } from "./types";

export const encodeSorting = (
	sorting: State["sorting"],
): string | undefined => {
	if (!sorting[0]) return undefined;
	const { id, desc } = sorting[0];
	return `${id}.${desc ? "desc" : "asc"}`;
};

export const decodeSorting = (sorting: Query[string]): State["sorting"] => {
	if (typeof sorting !== "string" || sorting === "") return [];
	const [id, desc] = sorting.split(".");
	invariant(id, "id not found");
	return [{ id, desc: desc === "desc" }];
};
