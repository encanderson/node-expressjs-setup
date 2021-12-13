// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv").config({
  path: "../node/.env",
}).parsed;

export const config = {
  secretkey: dotenv.SECRET_KEY,
  POSTGRESQL_URI: dotenv.POSTGRESQL_URI,
  PORT: 3000,
};
