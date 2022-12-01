const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
  sendMail(param) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PASSWORD_SENDER,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_RECEIVER,
      subject: `contact - Delaby Construction`,
      html: `
          <h2>Coordonnées :</h2>
          <ul>
            <li><b>email:</b> ${param.fullname}</li>
          </ul>
          <h2>Message :</h2>
          <p>${param.description}</p>
          `,
    };

    let info = transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  },
};
