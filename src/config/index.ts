import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  secretkey: process.env.SECRET_KEY,
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
  PORT: 3000,
};
