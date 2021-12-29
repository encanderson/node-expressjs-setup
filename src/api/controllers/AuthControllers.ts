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

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.user.token;
      const refreshToken = req.body.refreshToken;
      await AuthServices.logout(token, refreshToken);
      res.status(204).end();
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
      const userId = req.body.email;
      const token = await AuthServices.recoveryPassword(userId);
      res.status(200).send({
        message: "Verifique o seu email!",
        token: token,
      });
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
      const tokenId = req.params.token;
      const token = await AuthServices.checkUser(tokenId, code);

      res.status(200).send({
        token: token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async confirmUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const code = Number(req.body.code);
      const token = req.body.token;
      await AuthServices.confirmUser(token, code);

      res.status(202).send({
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
      const token = req.params.token;

      await AuthServices.changePassword({ password: password, token: token });

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
