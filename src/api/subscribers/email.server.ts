import { transporter, config } from "@src/config";

export const sendCode = async (email: string, code: number): Promise<void> => {
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: "Código de confirmação",
    html: `<h1>Código de verificação:</h1><p>${code}</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log(info.response);
      return code;
    }
  });
};
