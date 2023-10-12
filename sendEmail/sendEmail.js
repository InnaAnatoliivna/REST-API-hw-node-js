const nodemailer = require('nodemailer');
const smtpConfig = require('../smtpConfig/smtpConfig');

const { PORT, UKR_NET_MAIL } = process.env;


const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport(smtpConfig);

    const emailOptions = {
        from: UKR_NET_MAIL,
        to: email,
        subject: 'Verify Your Email',
        html: `<a target="_blank" href="http://localhost:${PORT}/users/verify/${verificationToken}">Click the link to verify your email</a>`,
    };

    try {
        await transporter
            .sendMail(emailOptions)
            .then(() => console.log('Email send success'))
            .catch(err => console.log("Error: ", err.message));
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = sendVerificationEmail;