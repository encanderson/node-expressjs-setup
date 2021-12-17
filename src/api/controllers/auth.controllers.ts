import { Request, Response, NextFunction } from "express";

import { AuthServices } from "../services";
export class AuthController {
  static async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).send(req.user);
    } catch (err) {
      next(err);
    }
  }

  static async recoveryPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email;
      await AuthServices.recoveryPassword(email);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  static async checkUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const code = Number(req.body.code);
      const email = req.body.email;
      await AuthServices.checkUser(email, code);

      res.status(200).send({
        message: "Usuário reconhecido",
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const password = req.body.password;
      const email = req.body.email;

      await AuthServices.changePassword(email, { password: password });

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
