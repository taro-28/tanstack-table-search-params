import type { ParsedUrlQuery } from "node:querystring";

// TODO: Change to URLSearchParams
export type Query = ParsedUrlQuery;

export type Router = {
  query: Query;
  push(url: string): void;
  pathname: string;
};
