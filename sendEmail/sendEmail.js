const nodemailer = require('nodemailer');
const smtpConfig = require('../smtpConfig/smtpConfig');

const { PORT } = process.env;


const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport(smtpConfig);

    const emailOptions = {
        from: 'your-email@example.com',
        to: email,
        subject: 'Verify Your Email',
        // text: `Click the link to verify your email: http://example.com/users/verify/${verificationToken}`
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