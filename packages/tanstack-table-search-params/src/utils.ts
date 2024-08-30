import type { Options, State } from ".";

export type ExtractSpecificStateOptions<STATE_NAME extends keyof State> = {
  [OPTION_NAME in keyof Required<Options> as OPTION_NAME extends "debounceMilliseconds"
    ? OPTION_NAME
    : OPTION_NAME extends `${infer T}s`
      ? T
      : OPTION_NAME]?: Required<Options>[OPTION_NAME][STATE_NAME];
};
