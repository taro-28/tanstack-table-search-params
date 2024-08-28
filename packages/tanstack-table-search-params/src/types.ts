import type { ParsedUrlQuery } from "node:querystring";

// TODO: Change to URLSearchParams
export type Query = ParsedUrlQuery;

export type Router<URL extends string = string> = {
  query: Query;
  push(url: URL): void;
  pathname: string;
};
