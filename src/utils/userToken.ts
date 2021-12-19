import jwt from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";

import { InvalidToken } from "@src/api/errors";
import { managerAllowlist } from "../api/subscribers";

import { config } from "@src/config";

interface DataStoredInToken {
  userId: string;
}

interface RefreshToken {
  refreshToken: string;
  expirationDate: number;
}

export class UserToken {
  static generateToken(userId: string): string {
    const token = jwt.sign({ userId }, config.secretkey, {
      expiresIn: "1m",
    });
    return token;
  }

  static verifyToken(token: string): string {
    try {
      const verify = jwt.verify(token, config.secretkey) as DataStoredInToken;

      return verify.userId;
    } catch (err) {
      throw new InvalidToken("Token Inválido");
    }
  }

  static async generateRefreshToken(userId: string): Promise<RefreshToken> {
    const expirationDate = moment().add(3, "d").unix();
    const refreshToken = crypto.randomBytes(24).toString("hex");

    await managerAllowlist.setKey(refreshToken, userId, expirationDate);
    return { refreshToken, expirationDate };
  }

  static async verifyRefreshToken(
    refreshToken: string
  ): Promise<{ token: string; userId: string }> {
    if (!refreshToken) {
      throw new InvalidToken("Refresh Token não informado");
    }
    const userId = await managerAllowlist.getKey(refreshToken);

    if (!userId) {
      throw new InvalidToken("Refresh Token inválido");
    }

    const token = this.generateToken(userId);

    return { userId, token };
  }

  static async deleteRefreshToken(refreshToken: string): Promise<void> {
    await managerAllowlist.delete(refreshToken);
  }
}
