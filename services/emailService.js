const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { to, subject, html } = options;

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    html,
  };

	console.log("SEND OPTIONS: ", msg);

	try {
		await sgMail.send(msg);
	} catch (error) {
		console.error(error);
	}
  
};

module.exports = sendEmail;
