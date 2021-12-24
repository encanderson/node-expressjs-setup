import { UserRepository } from "../repositories";

import { User as UserType } from "@src/types";
import { filterInput } from "@src/helpers";

import { sendEmail } from "../subscribers";
import { generateCode } from "@src/helpers";
import { htmlCode } from "../../config";

export class UsersServices {
  static async createUser(form: UserType): Promise<void> {
    const newUser = filterInput(form, ["email", "password", "name"]);

    const user = await UserRepository.searchByEmail(newUser);

    if (user) {
      const code = generateCode();
      await sendEmail(form.email, "Verificação de email", htmlCode(code));

      user.createUser(code);
    }
  }
}
