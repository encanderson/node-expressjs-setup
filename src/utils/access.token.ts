import jwt from "jsonwebtoken";

import { InvalidToken } from "@src/api/errors";

import { config } from "@src/config";

interface Payload {
  userId: string;
}

export class AccessToken {
  static generateToken(userId: string, expires: string): string {
    const token = jwt.sign({ userId }, config.secretkey, {
      expiresIn: expires,
    });
    return token;
  }

  static verifyToken(token: string): string {
    try {
      const verify = jwt.verify(token, config.secretkey) as Payload;

      return verify.userId;
    } catch (err) {
      throw new InvalidToken("Token Inválido");
    }
  }
}
