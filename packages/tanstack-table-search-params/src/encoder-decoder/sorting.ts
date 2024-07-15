import type { Decoder } from "./decoders";
import type { Encoder } from "./encoders";

export const encodeSorting: Encoder<"sorting"> = ({
  stateValue,
  paramName,
}) => {
  if (stateValue.length === 0) return {};
  return {
    [paramName]: stateValue
      .map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`)
      .join(","),
  };
};

export const decodeSorting: Decoder<"sorting"> = ({ query, paramName }) => {
  const queryValue = query[paramName];
  if (typeof queryValue !== "string" || queryValue === "") return [];

  try {
    return queryValue.split(",").map((sort) => {
      const [id, order] = sort.split(".");
      if (!id) throw new Error("Invalid sorting");
      if (order !== "asc" && order !== "desc") {
        throw new Error("Invalid sorting");
      }
      return { id, desc: order === "desc" };
    });
  } catch {
    return [];
  }
};
