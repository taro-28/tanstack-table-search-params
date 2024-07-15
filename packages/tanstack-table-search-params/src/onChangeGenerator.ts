import type { Updater } from "@tanstack/react-table";
import { type State, paramNames } from ".";
import type { Router } from "./types";

type Props<K extends keyof State> = {
  state: State;
  router: Router;
  encoder: (value: State[K]) => string | undefined;
};

export const onChangeGenerator =
  (key: keyof State, { router, state, encoder }: Props<typeof key>) =>
  (updaterOrValue: Readonly<Updater<State[typeof key]>>) => {
    const next = encoder(
      typeof updaterOrValue === "function"
        ? updaterOrValue(state[key])
        : updaterOrValue,
    );

    const { [paramNames[key]]: _, ...excludedQuery } = router.query;
    router.push({
      pathname: router.pathname,
      query: next ? { ...router.query, [key]: next } : excludedQuery,
    });
  };
