import type { ParsedUrlQuery } from "node:querystring";
import type { UrlObject } from "node:url";

export type Query = ParsedUrlQuery;
export type Router = {
  query: Query;
  push(url: UrlObject | string): Promise<boolean>;
  pathname: string;
};
