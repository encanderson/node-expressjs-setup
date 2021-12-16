import { Request, Response, NextFunction } from "express";

import { createUser } from "../services";

export class UsersController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.body;
      await createUser(user);
      res.status(201).send({
        message: `Seja bem vindo ${user.name}`,
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
