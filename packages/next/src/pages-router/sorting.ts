import invariant from "ts-invariant";
import type { State } from ".";
import type { Query } from "./types";

export const encodeSorting = (
	sorting: State["sorting"],
): string | undefined => {
	if (sorting.length === 0) return undefined;
	return sorting
		.map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
		.join(",");
};

export const decodeSorting = (sorting: Query[string]): State["sorting"] => {
	if (typeof sorting !== "string" || sorting === "") return [];

	try {
		return sorting.split(",").map((sort) => {
			const [id, order] = sort.split(".");
			invariant(order === "asc" || order === "desc");
			return { id, desc: order === "desc" };
		});
	} catch {
		return [];
	}
};
