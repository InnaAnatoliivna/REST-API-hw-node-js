const sendVerificationEmail = require('../sendEmail/sendEmail');
const service = require('../service/users')


const verify = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await service.userVerify({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed' });
        }

        await sendVerificationEmail(email, user.verificationToken);

        return res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getVerificationToken = async (req, res, next) => {
    const { verificationToken } = req.params;

    try {
        const user = await service.userVerifyToken(verificationToken);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verify = true;
        // user.verificationToken = null;
        await user.save();

        return res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    getVerificationToken,
    verify
}