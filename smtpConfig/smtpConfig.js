const { UKR_NET_MAIL, UKR_NET_PASSWORD } = process.env;

const smtpConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_MAIL,
        pass: UKR_NET_PASSWORD
    }
};


module.exports = smtpConfig