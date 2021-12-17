import { InvalidField } from "../api/errors";

export const filterObject = (obj: unknown, keys: string[]): unknown => {
  const newObject = {};
  keys.forEach((key) => (newObject[key] = obj[key]));
  return newObject;
};

export const filterInput = (obj: unknown, field: string[]): unknown => {
  const newObject = {};
  field.forEach((key) => {
    if (obj[key]) {
      newObject[key] = obj[key];
    } else {
      throw new InvalidField(
        `Preencher o campo ${key.toUpperCase()} -> ${key}.`
      );
    }
  });
  return newObject;
};
