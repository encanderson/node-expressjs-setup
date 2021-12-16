import * as bcrypt from "bcrypt";

import { NotAuthenticate } from "@src/api/errors";

import { UserModel } from "@src/api/repositories";
import { User } from "@src/types";

export const verifyUser = async (email: string): Promise<User> => {
  const user = await UserModel.getUser(email);
  if (!user) {
    throw new NotAuthenticate("Usuário");
  }
  return user;
};

export const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<void> => {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword) {
    throw new NotAuthenticate("Senha");
  }
};
