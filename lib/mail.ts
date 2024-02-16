import Handlebars from "handlebars";
import nodemailer from "nodemailer";

export default async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_USER, SMTP_PASS } = process.env;

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log("testResult", testResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (e) {
    console.log(e);
  }
}

export function compileTemplate(
  name: string,
  url: string,
  templateString: string,
) {
  const template = Handlebars.compile(templateString);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
}
