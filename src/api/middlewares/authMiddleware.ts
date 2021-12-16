import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { generateToken } from "@src/utils";
import { NotAuthenticate } from "../errors";

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    "local",
    { session: false },
    async (error, user, info) => {
      if (error && error.name === "NotAuthenticate") {
        return res.status(401).send({ message: error.message });
      }
      if (error) {
        return res.status(500).send({ message: error.message });
      }
      if (!user) {
        return res.status(401).send({ message: info });
      }

      const token = await generateToken(user.email);
      req.user = {
        ...user,
        token,
      };
      next();
    }
  )(req, res, next);
};

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate("bearer", { session: false }, (error, userId) => {
    if (req.path === "/users/create") return next();

    if (error && error.name === "InvalidToken") {
      return res.status(401).send({ message: error.message });
    }
    if (error) {
      return res.status(500).send({ message: error.message });
    }

    if (!userId) {
      throw new NotAuthenticate("Token");
    }

    req.user = userId;
    next();
  })(req, res, next);
};
