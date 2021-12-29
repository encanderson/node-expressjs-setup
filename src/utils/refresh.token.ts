import crypto from "crypto";
import moment from "moment";

import { InvalidToken } from "@src/api/errors";
import { managerAllowlist } from "../api/subscribers";

interface RefreshData {
  refreshToken: string;
  expirationDate: number;
}

export class RefreshToken {
  static async generateToken(userId: string): Promise<RefreshData> {
    const expirationDate = moment().add(3, "d").unix();
    const refreshToken = crypto.randomBytes(24).toString("hex");

    await managerAllowlist.setKey(refreshToken, userId, expirationDate);
    return { refreshToken, expirationDate };
  }

  static async verifyToken(refreshToken: string): Promise<{ userId: string }> {
    if (!refreshToken) {
      throw new InvalidToken("Refresh Token não informado");
    }
    const userId = await managerAllowlist.getKey(refreshToken);

    if (!userId) {
      throw new InvalidToken("Refresh Token inválido");
    }

    return { userId };
  }

  static async deleteToken(refreshToken: string): Promise<void> {
    await managerAllowlist.delete(refreshToken);
  }
}
// userId, "15m"
