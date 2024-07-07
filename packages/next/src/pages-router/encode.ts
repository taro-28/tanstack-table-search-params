import { encodeSorting } from "./sorting";
import { encodeGlobalFilter } from "./globalFilter";
import type { State } from ".";

type Encoder = (value: State[keyof State]) => string | undefined;

export const encoders = {
	globalFilter: encodeGlobalFilter,
	sorting: encodeSorting,
} as const satisfies Record<keyof State, Encoder>;
