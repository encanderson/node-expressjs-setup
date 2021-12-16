import { UserModel } from "../repositories";

import { User as UserType } from "@src/types";

export const createUser = async (newUser: UserType): Promise<void> => {
  const user = await UserModel.searchByEmail(newUser);

  if (user) {
    user.createUser();
  }
};
