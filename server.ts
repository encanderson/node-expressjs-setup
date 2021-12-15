import http from "http";
require("express-async-errors");

import { App } from "./src/app";

import { config } from "./src/config";
class Server {
  httpServer: http.Server;
  app: App;
  api;
  constructor() {
    this.app = new App();
    this.app.start();
  }

  init() {
    this.httpServer = http.createServer(this.app.app);

    this.httpServer.listen(config.PORT, () => {
      console.log(`Listening at ${config.PORT}`);
    });
  }
}

new Server().init();
