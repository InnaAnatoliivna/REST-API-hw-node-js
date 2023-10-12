const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const User = require('../service/schemes/models/schemaUsers');
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const sendVerificationEmail = require('../sendEmail/sendEmail');
const { uuid } = require('uuidv4');

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

// REGISTRATION

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email in use' });
        }

        const verificationToken = uuid();

        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar = gravatar.url(email, { s: '250', d: 'retro' });
        const newUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: avatar,
            verificationToken
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// LOGIN

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        await User.findByIdAndUpdate(user._id, { token });

        await user.save();

        return res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// LOGOUT

const logout = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        user.token = null;
        await user.save();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// CURRENT_USER

const getCurrentUser = (req, res) => {
    const { email, subscription } = req.user;
    return res.status(200).json({ email, subscription });
};

// AVATAR

const avatarUpdate = async (req, res, next) => {
    try {
        const { path: tempUpload, originalname } = req.file;
        const filename = `${req.user._id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, filename);
        try {
            await fs.rename(tempUpload, resultUpload);
        } catch (error) {
            fs.unlink(tempUpload);
            next(error);
        }
        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(req.user._id, { avatarURL });
        res.status(200).json({ avatarURL });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Avatar upload failed.' });
        next(error);
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    avatarUpdate
};
