import type { Query, Router } from "./types";

type Props = {
  oldQuery: Query;
  newQuery: Query;
  router: Router;
};

export const updateQuery = async ({ oldQuery, newQuery, router }: Props) => {
  const oldQueryEntries = Object.entries(oldQuery);
  const newQueryEntries = Object.entries(newQuery);

  if (
    oldQueryEntries.length === newQueryEntries.length &&
    oldQueryEntries.every(([key, value]) => newQuery[key] === value)
  ) {
    return;
  }

  const oldQueryParamNames = Object.keys(oldQuery);
  const unchangedQuery = Object.fromEntries(
    Object.entries(router.query).filter(
      ([key]) => !oldQueryParamNames.includes(key),
    ),
  );

  const newQueryExcludedUndefined = Object.fromEntries(
    Object.entries(newQuery).filter(([, value]) => value !== undefined),
  );

  await router.push({
    pathname: router.pathname,
    query: { ...unchangedQuery, ...newQueryExcludedUndefined },
  });
};
