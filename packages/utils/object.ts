export const typedObjectEntries = <K extends string | number | symbol, V>(
  obj: Record<K, V>
): [K, V][] => {
  return Object.entries(obj) as [K, V][];
};

export const typedObjectKeys = <T extends { [key: string]: unknown }>(
  obj: T
): (keyof T)[] => {
return Object.keys(obj);
};
