import http from "http";
require("express-async-errors");

import app from "./src/api";

import { config } from "./src/config";

const PORT = config.PORT;

export const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
