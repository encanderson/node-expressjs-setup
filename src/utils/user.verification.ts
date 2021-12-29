import * as bcrypt from "bcrypt";

import { NotAuthenticate, NotFound } from "@src/api/errors";

import { UserRepository } from "@src/api/repositories";
import { User } from "@src/@types";

export class UserVerification {
  static async verifyUser(email: string): Promise<User> {
    const user = await UserRepository.getUser(email);
    if (!user) {
      throw new NotFound("Usuário");
    }
    return user;
  }

  static async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<void> {
    const validPassword = await bcrypt.compare(password, hashPassword);
    if (!validPassword) {
      throw new NotAuthenticate("Senha inválida.");
    }
  }
}
