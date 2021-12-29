import { Request, Response, NextFunction } from "express";

import { accessController } from "../validators";
import { Forbideen } from "../errors";

export const accessControllMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permissions = accessController.can(req.user.app).readAny("contacts");

    if (permissions.granted === false) {
      throw new Forbideen();
    }

    req.access = {
      permissions: permissions,
    };
    next();
  } catch (e) {
    throw new Forbideen();
  }
};
