import jwt from "jsonwebtoken";

import { InvalidToken } from "@src/api/errors";

import { config } from "@src/config";

interface DataStoredInToken {
  userId: string;
}

export const generateToken = async (
  userId: string
): Promise<string | boolean> => {
  const token = jwt.sign({ userId }, config.secretkey, {
    expiresIn: 86400,
  });
  return token;
};

export const verifyToken = (token: string): string => {
  try {
    const verify = jwt.verify(token, config.secretkey) as DataStoredInToken;

    return verify.userId;
  } catch (err) {
    throw new InvalidToken("Token Inválido");
  }
};
