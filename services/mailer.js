import nodemailer from 'nodemailer';

export default function (from, appPassword, to, subject, htmlMsg) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: htmlMsg,
    };
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: from, pass: appPassword },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      error ? reject(error) : resolve(info);
    });
  });
}
