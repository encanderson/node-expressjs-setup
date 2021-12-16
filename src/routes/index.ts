import express from "express";

import { router as docsRouter } from "./docs.routes";
import { router as userRouter } from "./users.routes";

const routes = (app: express.Application): void => {
  app.use("/docs", docsRouter);
  app.use("/api/v1", userRouter);
};

export default routes;
