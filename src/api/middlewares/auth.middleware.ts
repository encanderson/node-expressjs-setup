import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { UserRepository } from "@src/api/repositories";
import { RefreshToken, AccessToken } from "@src/utils";
import { InvalidToken } from "../errors";

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
      if (error && error.name === "NotFound") {
        return res.status(401).send({ message: error.message });
      }
      if (error) {
        return res.status(500).send({ message: error.message });
      }
      if (!user) {
        return res.status(401).send({ message: info });
      }

      const token = AccessToken.generateToken({
        userId: user.email,
        expires: "15m",
        app: user.app,
      });
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
    try {
      passport.authenticate(
        "bearer",
        { session: false },
        (error, payload, token) => {
          if (!payload) {
            return res.status(401).send({
              message: new InvalidToken("Token ou Refresh Token Inválido")
                .message,
            });
          }

          if (error && error.name === "InvalidToken") {
            return res.status(401).send({ message: error.message });
          }

          if (error && error.name === "NotFound") {
            return res.status(401).send({ message: error.message });
          }

          if (error) {
            return res.status(500).send({ message: error.message });
          }

          req.user = {
            userId: payload.userId,
            token,
            app: payload.app,
          };
          next();
        }
      )(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const { userId } = await RefreshToken.verifyToken(refreshToken);

      const user = await UserRepository.getUser(userId);

      delete user.password;

      const token = AccessToken.generateToken({
        userId: userId,
        expires: "15m",
        app: user.app,
      });

      await RefreshToken.deleteToken(refreshToken);

      req.user = user;
      req.user.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }
}
