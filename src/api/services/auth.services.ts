import { UserModel } from "../repositories";

import { NotAuthenticate } from "@src/api/errors";

import { sendEmail } from "../subscribers";
import { generateCode } from "@src/helpers";
import { Blocklist, managerAllowlist } from "../subscribers";
import { htmlCode } from "../../config";

export class AuthServices {
  static async recoveryPassword(email: string): Promise<void> {
    const code = generateCode();

    const user = await UserModel.recoveryPassword(email, code);

    await sendEmail(user.email, "Código de Verificação", htmlCode(code));
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

  static async logout(token: string, refreshToken: string): Promise<void> {
    await managerAllowlist.delete(refreshToken);

    await Blocklist.setToken(token);
  }
}
