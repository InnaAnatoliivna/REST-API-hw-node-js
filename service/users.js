const User = require('../service/schemes/models/schemaUsers');

const userVerify = async (email) => {
    return await User.findOne({ email: email });
}

const userVerifyToken = async (token) => {
    return await User.findOne({ verificationToken: token });
}

const verificationTokenUpdate = async (userId, verifyStatus, verificationToken) => {
    return await User.findByIdAndUpdate(
        { _id: userId },
        {
            verify: verifyStatus,
            verificationToken: verificationToken
        }
    );
}

module.exports = {
    userVerify,
    userVerifyToken,
    verificationTokenUpdate
};