import nodemailer from "nodemailer";

import { config, createEmailSettings } from "@src/config";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const createTransporter = async (mailOptions: MailOptions): Promise<void> => {
  const settingsEmail = await createEmailSettings();
  const transporter = nodemailer.createTransport(settingsEmail);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("URL: " + nodemailer.getTestMessageUrl(info));
      }
    }
  });
};

export const sendEmail = async (
  email: string,
  subject: string,
  html: string
): Promise<void> => {
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: subject,
    html: html,
  };

  await createTransporter(mailOptions);
};
