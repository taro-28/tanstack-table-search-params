import { decodeGlobalFilter } from "./globalFilter";

import type { State } from "..";
import { decodeSorting } from "./sorting";
import type { Query } from "../types";

export type Decoder<KEY extends keyof State> = (value: {
  query: Query;
  paramName: string;
}) => State[KEY];

export const decoders = {
  globalFilter: decodeGlobalFilter,
  sorting: decodeSorting,
} as const satisfies {
  [KEY in keyof State]: Decoder<KEY>;
};
