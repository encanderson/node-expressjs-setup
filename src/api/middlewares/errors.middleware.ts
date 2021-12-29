import express, { Request, Response, NextFunction } from "express";

import {
  NotFound,
  UserExist,
  NotSupport,
  NotAuthenticate,
  InvalidToken,
  InvalidField,
  Forbideen,
} from "../errors";
import { ErrorType } from "@src/@types/error";

export const errorMiddleware = (app: express.Application): void => {
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: ErrorType, req: Request, res: Response, next: NextFunction) => {
      let status = 500;

      if (error instanceof NotFound) {
        status = 404;
      }

      if (error instanceof UserExist) {
        status = 409;
      }

      if (error instanceof NotSupport) {
        status = 406;
      }

      if (error instanceof NotAuthenticate || error instanceof InvalidToken) {
        status = 401;
      }

      if (error instanceof InvalidField) {
        status = 400;
      }

      if (error instanceof Forbideen) {
        status = 403;
      }

      res.status(status).send({
        message: error.message,
      });
    }
  );
};
