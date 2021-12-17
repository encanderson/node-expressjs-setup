import { UserModel } from "../repositories";

import { User as UserType } from "@src/types";
import { filterInput } from "@src/helpers";

export class UsersServices {
  static async createUser(form: UserType): Promise<void> {
    const newUser = filterInput(form, ["email", "password", "name"]);

    const user = await UserModel.searchByEmail(newUser);

    if (user) {
      user.createUser();
    }
  }
}
