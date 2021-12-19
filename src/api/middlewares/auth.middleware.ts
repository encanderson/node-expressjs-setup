import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { UserModel } from "@src/api/repositories";
import { UserToken } from "@src/utils";
import { NotAuthenticate } from "../errors";

export class AuthMiddleware {
  static async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error && error.name === "NotAuthenticate") {
        return res.status(401).send({ message: error.message });
      }
      if (error) {
        return res.status(500).send({ message: error.message });
      }
      if (!user) {
        return res.status(401).send({ message: info });
      }

      const token = UserToken.generateToken(user.email);
      req.user = {
        ...user,
        token,
      };
      next();
    })(req, res, next);
  }

  static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate(
      "bearer",
      { session: false },
      (error, userId, token) => {
        if (error && error.name === "InvalidToken") {
          return res.status(401).send({ message: error.message });
        }
        if (error) {
          return res.status(500).send({ message: error.message });
        }

        if (!userId) {
          throw new NotAuthenticate("Token");
        }

        req.user = {
          userId,
          token,
        };
        next();
      }
    )(req, res, next);
  }

  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const { userId, token } = await UserToken.verifyRefreshToken(
        refreshToken
      );

      const user = await UserModel.getUser(userId);

      delete user.password;

      await UserToken.deleteRefreshToken(refreshToken);

      req.user = user;
      req.user.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }
}
