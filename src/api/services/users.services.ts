import { UserModel } from "../repositories";

import { User as UserType } from "@src/types";
import { filterInput } from "@src/helpers";

export const createUser = async (form: UserType): Promise<void> => {
  const newUser = filterInput(form, ["email", "password", "name"]);

  // eslint-disable-next-line
  // @ts-ignore
  const user = await UserModel.searchByEmail(newUser);

  if (user) {
    user.createUser();
  }
};
