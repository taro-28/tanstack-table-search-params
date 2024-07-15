import type { State } from "..";
import type { Query } from "../types";
import { encodeGlobalFilter } from "./globalFilter";
import { encodeSorting } from "./sorting";

export type Encoder<KEY extends keyof State> = KEY extends keyof State
  ? (value: {
      stateValue: State[KEY];
      paramName: string;
    }) => Query
  : never;

export const encoders = {
  globalFilter: encodeGlobalFilter,
  sorting: encodeSorting,
} as const satisfies {
  [KEY in keyof State]: Encoder<KEY>;
};
