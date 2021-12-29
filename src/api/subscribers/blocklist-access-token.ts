import * as redis from "redis";
import jwt from "jsonwebtoken";

import { managerList } from "@src/redis";

import { hashFunction } from "@src/utils";
import { InvalidToken } from "../errors";

const blocklist = redis.createClient({
  prefix: "blocklist-access-token:",
});

const managerBlocklist = managerList(blocklist);

export class Blocklist {
  static async setToken(token: string): Promise<void> {
    const tokenHash = hashFunction(token);

    const { exp } = jwt.decode(token);
    await managerBlocklist.setKey(tokenHash, "", exp);
  }

  static async verifyToken(token: string): Promise<void> {
    const tokenHash = hashFunction(token);
    const check = await managerBlocklist.isKey(tokenHash);
    if (check) {
      throw new InvalidToken("Token inválido por logout");
    }
  }

  static async delete(token: string): Promise<void> {
    await managerBlocklist.delete(token);
  }
}
