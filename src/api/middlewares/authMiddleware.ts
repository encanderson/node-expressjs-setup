import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    req.user = user;
    next();
  })(req, res, next);
};
