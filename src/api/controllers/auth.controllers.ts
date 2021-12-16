import { Request, Response, NextFunction } from "express";

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    next(err);
  }
};

export const recoveryPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).send(req.body);
};
