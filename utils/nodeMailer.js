
const nodemailer = require("nodemailer");


const fmMailer = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass:  process.env.SMTP_PASSWORD
        }
    });


    const email = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
        to: options.email,
        subject: options.subject,
        text: options.message

    };

    await transporter.sendMail(email)


}

module.exports = fmMailer;
