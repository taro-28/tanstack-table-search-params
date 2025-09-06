export const typedObjectEntries = <K extends PropertyKey, V>(
  object: Record<K, V>,
): [K, V][] => Object.entries(object) as [K, V][];
