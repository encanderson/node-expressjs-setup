import { Request, Response, NextFunction } from "express";

import { UsersServices } from "../services";

export class UsersController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.body;
      const token = await UsersServices.createUser(user);
      res.status(201).send({
        message: `Seja bem vindo ${user.name}, verifique o seu email.`,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).send({
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
