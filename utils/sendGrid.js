const sendGrid = require("@sendgrid/mail");

exports.sendGridMail = async (name, email, reset_link) => {
    sendGrid.setApiKey(process.env.SENDGRID_API);

    const message = {
        to: email,
        from: process.env.FROM_EMAIL,
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamic_template_data: {
            user: name,
            reset_link: reset_link
        }
    }

    await sendGrid.send(message);

}

