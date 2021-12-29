/* eslint-disable @typescript-eslint/ban-ts-comment */

import { InvalidField } from "../api/errors";

import { User } from "@src/@types";

export const filterObject = (obj: unknown, keys: string[]): unknown => {
  const newObject = {};
  keys.forEach((key) => (newObject[key] = obj[key]));
  return newObject;
};

export const filterInput = (obj: unknown, field: string[]): User => {
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

  // @ts-ignore
  return newObject;
};
