import { UserRepository } from "../repositories";

import { User as UserType } from "@src/@types";
import { filterInput } from "@src/helpers";

import { sendEmail } from "../subscribers";
import { generateCode } from "@src/helpers";
import { htmlCode } from "../../config";
import { AccessToken } from "../../utils";

export class UsersServices {
  static async createUser(form: UserType): Promise<string> {
    const newUser = filterInput(form, [
      "app",
      "cpf",
      "email",
      "password",
      "profession",
      "name",
    ]);

    const user = await UserRepository.searchByEmail(newUser);

    if (user) {
      const code = generateCode();
      await sendEmail(form.email, "Verificação de email", htmlCode(code));

      user.createUser(code);

      return AccessToken.generateToken({
        userId: form.email,
        expires: "5m",
        app: newUser.app,
      });
    }
  }
}
