/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Contact } from "../../@types";

export const filterContact = (obj: Contact): Contact => {
  const fields = ["name", "email", "phone", "message"];
  const newObject: Contact | unknown = {};

  for (const [key] of Object.entries(obj)) {
    if (fields.indexOf(obj[key])) {
      newObject[key] = obj[key];
    }
  }

  // @ts-ignore
  return newObject;
};
