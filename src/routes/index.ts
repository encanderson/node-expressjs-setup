import express from "express";

import { router as docsRouter } from "./docs.routes";

const routes = (app: express.Application): void => {
  app.use("/docs", docsRouter);
};

export default routes;
