import http from "http";
require("express-async-errors");

import { App } from "./src/app";

import { config } from "./src/config";

require("./src/redis");
class Server {
  httpServer: http.Server;
  app: App;
  constructor() {
    this.app = new App();
    this.app.start();
  }

  start() {
    this.httpServer = http.createServer(this.app.app);

    this.httpServer.listen(config.PORT, () => {
      console.log(`Listening at ${config.PORT}`);
    });
  }
}

new Server().start();
