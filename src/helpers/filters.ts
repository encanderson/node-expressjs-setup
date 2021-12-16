export const filterObject = (obj: unknown, keys: string[]): unknown => {
  const newObject = {};
  keys.forEach((key) => (newObject[key] = obj[key]));
  return newObject;
};
