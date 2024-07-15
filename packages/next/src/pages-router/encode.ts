import type { State } from ".";
import { encodeGlobalFilter } from "./globalFilter";
import { encodeSorting } from "./sorting";

type Encoder = (value: State[keyof State]) => string | undefined;

export const encoders = {
  globalFilter: encodeGlobalFilter,
  sorting: encodeSorting,
} as const satisfies Record<keyof State, Encoder>;
