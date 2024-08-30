import { useEffect, useState } from "react";
import type { State } from ".";

type Props<KEY extends keyof State> = {
  stateValue: State[KEY];
  updateQuery: (stateValue: State[KEY]) => Promise<void>;
  milliseconds?: number | undefined;
};

export const useDebounce = <KEY extends keyof State>({
  stateValue,
  milliseconds,
  updateQuery,
}: Props<KEY>): ReturnType<typeof useState<State[KEY]>> => {
  const [debouncedValue, setDebouncedValue] = useState(stateValue);

  useEffect(() => {
    if (milliseconds === undefined) return;
    const handler = setTimeout(() => updateQuery(debouncedValue), milliseconds);
    return () => clearTimeout(handler);
  }, [debouncedValue, milliseconds, updateQuery]);

  useEffect(() => {
    if (milliseconds === undefined) return;
    setDebouncedValue(stateValue);
  }, [stateValue, milliseconds]);

  return [debouncedValue, setDebouncedValue];
};
