import http from "http";
require("express-async-errors");

import { App } from "./src/app";

import { config } from "./src/config";

require("./src/api/subscribers");
class Server {
  httpServer: http.Server;
  app: App;
  constructor() {
    this.app = new App();
    this.app.start();
  }

  start(PORT: number) {
    this.httpServer = http.createServer(this.app.app);

    this.httpServer.listen(PORT, () => {
      console.log(`Listening at ${PORT}`);
    });
  }
}

new Server().start(config.PORT);
