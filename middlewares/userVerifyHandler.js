const userVerifyHandler = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Missing required field: email' });
    }
    next();
}

const userVerificationTokenHandler = (req, res, next) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
        return res.status(400).json({ message: 'Verification token is required' });
    }
    next();
}

module.exports = {
    userVerifyHandler,
    userVerificationTokenHandler
}