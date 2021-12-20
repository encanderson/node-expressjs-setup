import { ServerSetup } from "./src/server";

import { config } from "./src/config";

(async (): Promise<void> => {
  try {
    const server = new ServerSetup();
    await server.init();

    server.start(config.PORT);
  } catch (error) {
    console.log(error);
  }
})();
