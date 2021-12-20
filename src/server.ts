import http from "http";
import express, { json, urlencoded } from "express";
import cors from "cors";
require("express-async-errors");

import routes from "./routes";

import { headersMiddleware, errorMiddleware } from "./api/middlewares";

require("./api/subscribers");

import logger from "./logs";

export class ServerSetup {
  httpServer: http.Server;
  app: express.Application;
  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    this.setupExpress();
  }

  private setupExpress(): void {
    headersMiddleware(this.app);

    this.app.use(cors());
    this.app.use(json());
    this.app.use(
      urlencoded({
        extended: true,
      })
    );

    routes(this.app);

    errorMiddleware(this.app);
  }

  start(PORT: number): void {
    this.httpServer = http.createServer(this.app);

    this.httpServer.listen(PORT, () => {
      logger.info(`Listening at ${PORT}`);
    });
  }
}
