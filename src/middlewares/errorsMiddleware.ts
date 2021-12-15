import express, { Request, Response, NextFunction } from "express";

import { NotFound, UserExist, NotSupport } from "../errors";
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

      res.status(status).send({
        message: error.message,
        idError: error.idError,
      });
    }
  );
};
