import nodemailer from "nodemailer";

import { config } from "./";

export const transporter = nodemailer.createTransport({
  host: config.emailServer,
  port: 465,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});
