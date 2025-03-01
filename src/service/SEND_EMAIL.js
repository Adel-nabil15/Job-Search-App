import nodemailer from "nodemailer";

export const Send_Email = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIAPPLPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"M:Adel" ${process.env.EMAIL}`,
    to: to,
    subject: subject,
    html: html,
  });
  if (info.accepted.length) {
    return true;
  }
  return false;
};

export default Send_Email
