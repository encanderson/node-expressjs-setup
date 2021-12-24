import { UserRepository } from "../repositories";

import { NotAuthenticate } from "@src/api/errors";

import { sendEmail } from "../subscribers";
import { generateCode } from "@src/helpers";
import { Blocklist, managerAllowlist } from "../subscribers";
import { htmlCode } from "../../config";
import { AccessToken } from "../../utils";

export class AuthServices {
  static async recoveryPassword(email: string): Promise<void> {
    const code = generateCode();

    const user = await UserRepository.recoveryPassword(email, code);

    await sendEmail(user.email, "Código de Verificação", htmlCode(code));
  }
  static async checkUser(email: string, code: number): Promise<string> {
    const user = await UserRepository.checkUser(email);

    if (user) {
      if (user.code === code) {
        const token = AccessToken.generateToken(email, "5m");

        return token;
      } else {
        throw new NotAuthenticate("Código");
      }
    }
  }

  static async confirmUser(email: string, code: number): Promise<void> {
    const user = await UserRepository.checkUser(email);

    if (user) {
      if (user.code === code) {
        await UserRepository.update(email, { active: true });
      } else {
        throw new NotAuthenticate("Código");
      }
    }
  }
  static async changePassword(data: {
    password: string;
    token: string;
  }): Promise<void> {
    const userId = AccessToken.verifyToken(data.token);

    await UserRepository.update(userId, { password: data.password });
  }

  static async logout(token: string, refreshToken: string): Promise<void> {
    await managerAllowlist.delete(refreshToken);

    await Blocklist.setToken(token);
  }
}
