import express from "express";
import redoc from "redoc-express";

import { getSwagger } from "@src/controllers";

const router = express.Router();

router.get(
  "/",
  redoc({
    title: "API",
    specUrl: "/docs/swagger.json",
  })
);

router.get("/swagger.json", getSwagger);

module.exports = (app: express.Application) => app.use("/docs", router);
