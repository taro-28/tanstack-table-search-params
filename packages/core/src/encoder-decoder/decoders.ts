import { decodeGlobalFilter } from "./globalFilter";

import type { State } from "..";
import { decodeSorting } from "./sorting";
import type { Query } from "../types";

type Decoder = (value: Query[string]) => State[keyof State];

export const decoders = {
  globalFilter: decodeGlobalFilter,
  sorting: decodeSorting,
} as const satisfies Record<keyof State, Decoder>;
