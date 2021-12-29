import { ServerSetup } from "./server";

import { config } from "./config";

(async (): Promise<void> => {
  try {
    const server = new ServerSetup();
    await server.init();

    server.start(config.PORT);
  } catch (error) {
    console.log(error);
  }
})();
