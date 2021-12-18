import jwt from "jsonwebtoken";

import { existsAsync, setAsync } from "@src/redis";

import { hashFunction } from "@src/utils";
import { InvalidToken } from "../errors";

export class Blocklist {
  static async setToken(token: string): Promise<void> {
    const tokenHash = hashFunction(token);

    const { exp } = jwt.decode(token);
    await setAsync(tokenHash, exp, "");
  }

  static async verifyToken(token: string): Promise<void> {
    const tokenHash = hashFunction(token);
    const check = await existsAsync(tokenHash);
    if (check === 1) {
      throw new InvalidToken("Token inválido por logout");
    }
  }
}
