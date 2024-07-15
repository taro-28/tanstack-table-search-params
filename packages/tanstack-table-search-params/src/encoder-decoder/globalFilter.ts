import type { Decoder } from "./decoders";
import type { Encoder } from "./encoders";

export const encodeGlobalFilter: Encoder<"globalFilter"> = ({
  stateValue,
  paramName,
}) => {
  const queryValue =
    typeof stateValue === "string" && stateValue !== ""
      ? stateValue
      : undefined;
  return queryValue === undefined ? {} : { [paramName]: queryValue };
};

export const decodeGlobalFilter: Decoder<"globalFilter"> = ({
  query,
  paramName,
}) => {
  const queryValue = query[paramName];
  return typeof queryValue === "string" ? queryValue : "";
};
