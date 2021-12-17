import { UserModel } from "../repositories";

import { NotAuthenticate } from "@src/api/errors";

import { sendCode } from "../subscribers";
import { generateCode } from "@src/helpers";

export class AuthServices {
  static async recoveryPassword(email: string): Promise<void> {
    const code = generateCode();

    const user = await UserModel.recoveryPassword(email, code);

    await sendCode(user.email, code);
  }
  static async checkUser(email: string, code: number): Promise<unknown> {
    const user = await UserModel.checkUser(email);

    if (user) {
      if (user.code === code) {
        return true;
      } else {
        throw new NotAuthenticate("Código");
      }
    }
  }
  static async changePassword(
    email: string,
    data: { password: string }
  ): Promise<void> {
    await UserModel.update(email, data);
  }
}
