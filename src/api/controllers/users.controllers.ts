import { Request, Response, NextFunction } from "express";

import { createUser as create } from "../services";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.body;
    await create(user);
    res.status(201).send({
      message: `Seja bem vindo ${user.name}`,
    });
  } catch (error) {
    next(error);
  }
};
