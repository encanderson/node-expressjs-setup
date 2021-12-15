import express, { Request, Response, NextFunction } from "express";

import { NotSupport } from "../errors";

import { formatsAccepts } from "@src/config/constants";

export const headersMiddleware = (app: express.Application): void => {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("X-Powered-By", "PHP/7.1.7");

    let applicationFormat = req.header("Accept");

    const originalUrl = req.originalUrl;

    if (applicationFormat === "*/*") {
      applicationFormat = "application/josn";
    }

    if (
      formatsAccepts.indexOf(applicationFormat) === -1 &&
      originalUrl !== "/docs" &&
      originalUrl !== "/docs/swagger.json"
    ) {
      throw new NotSupport(applicationFormat);
    }

    res.setHeader("Content-Type", applicationFormat);
    next();
  });
};
