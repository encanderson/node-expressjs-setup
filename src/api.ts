import express, { json, urlencoded } from "express";
import cors from "cors";

import routes from "./routes";

import { headersMiddleware, errorMiddleware } from "./api/middlewares";

const app = express();

headersMiddleware(app);

app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

routes(app);

errorMiddleware(app);

export default app;
