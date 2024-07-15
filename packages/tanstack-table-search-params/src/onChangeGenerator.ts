import type { Updater } from "@tanstack/react-table";
import type { State } from ".";
import type { Router } from "./types";
import type { Encoder } from "./encoder-decoder/encoders";

type Props<KEY extends keyof State> = {
  paramName: string;
  stateValue: State[KEY];
  router: Router;
  encoder: Encoder<KEY>;
};

export const onChangeGenerator =
  <KEY extends keyof State>({
    paramName,
    router,
    stateValue,
    encoder,
  }: Props<KEY>) =>
  (updaterOrValue: Readonly<Updater<State[KEY]>>) => {
    const nextQuery = encoder({
      stateValue:
        typeof updaterOrValue === "function"
          ? updaterOrValue(stateValue)
          : updaterOrValue,
      paramName,
    });

    const { [paramName]: _, ...excludedQuery } = router.query;
    router.push({
      pathname: router.pathname,
      query: { ...excludedQuery, ...nextQuery },
    });
  };
