const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { to, subject, html } = options;

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    html,
  };

  return await sgMail.send(msg);
};

module.exports = sendEmail;
