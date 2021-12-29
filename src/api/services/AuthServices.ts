import { UserRepository } from "../repositories";

import { NotAuthenticate, InvalidField } from "@src/api/errors";

import { sendEmail } from "../subscribers";
import { generateCode } from "@src/helpers";
import { Blocklist, managerAllowlist } from "../subscribers";
import { htmlCode } from "../../config";
import { AccessToken } from "../../utils";

export class AuthServices {
  static async recoveryPassword(userId: string): Promise<string> {
    const code = generateCode();

    if (!userId) {
      throw new InvalidField("Email não informado");
    }

    const user = await UserRepository.recoveryPassword(userId, code);

    await sendEmail(user.email, "Código de Verificação", htmlCode(code));

    return AccessToken.generateToken({
      userId: userId,
      expires: "5m",
      app: user.app,
    });
  }
  static async checkUser(tokenId: string, code: number): Promise<string> {
    const { userId } = AccessToken.verifyToken(tokenId);

    const user = await UserRepository.checkUser(userId);

    if (user) {
      if (user.code === code) {
        const token = AccessToken.generateToken({
          userId: userId,
          expires: "5m",
          app: user.app,
        });

        return token;
      } else {
        throw new NotAuthenticate("Código Inválido");
      }
    }
  }

  static async confirmUser(token: string, code: number): Promise<void> {
    const { userId } = AccessToken.verifyToken(token);

    const user = await UserRepository.checkUser(userId);

    if (user) {
      if (user.code === code) {
        await UserRepository.update(userId, { active: true });
      } else {
        throw new NotAuthenticate("Código Inválido");
      }
    }
  }
  static async changePassword(data: {
    password: string;
    token: string;
  }): Promise<void> {
    const { userId } = AccessToken.verifyToken(data.token);

    await UserRepository.update(userId, { password: data.password });
  }

  static async logout(token: string, refreshToken: string): Promise<void> {
    try {
      await managerAllowlist.delete(refreshToken);

      await Blocklist.setToken(token);
    } catch (err) {
      throw new NotAuthenticate("Token");
    }
  }
}
