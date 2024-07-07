import { decodeGlobalFilter } from "./globalFilter";

import type { State } from ".";
import type { Query } from "./types";
import { typedObjectKeys } from "../../../utils/object";
import { decodeSorting } from "./sorting";

type Decoder = (value: Query[string]) => State[keyof State];

const decoders = {
	globalFilter: decodeGlobalFilter,
	sorting: decodeSorting,
} as const satisfies Record<keyof State, Decoder>;

export const decode = (query: Query): State => {
	const entries = typedObjectKeys(decoders).map((key) => [
		key,
		decoders[key](query[key]),
	]);
	return Object.fromEntries(entries);
};
