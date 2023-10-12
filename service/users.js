const User = require('../service/schemes/models/schemaUsers');

const userVerify = async (body) => {
    return await User.findOne({ body });
}

const userVerifyToken = async (token) => {
    return await User.findOne({ verificationToken: token });
}

module.exports = {
    userVerify,
    userVerifyToken
};