import { Request, Response, NextFunction } from "express";

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

  static async recoveryPassword(req: Request, res: Response): Promise<void> {
    res.status(200).send(req.body);
  }
}
