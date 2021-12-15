import express, { json, urlencoded } from "express";
import cors from "cors";

import routes from "./routes";

import { headersMiddleware, errorMiddleware } from "./api/middlewares";

export class App {
  app: express.Application;
  constructor() {
    this.app = express();
  }

  start(): void {
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
}
