const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const User = require('../service/schemes/models/schemaUsers');
const jwt = require("jsonwebtoken");
const jimp = require('jimp');
const path = require("path");
const fs = require("fs/promises");

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar = gravatar.url(email);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: avatar
        });

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

        // user.token = token;
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

const avatarUpdate = async (req, res) => {
    const { filename } = req.file;
    const targetPath = path.join(avatarsDir, filename);
    try {
        const image = await jimp.read(req.file.path);
        await image.cover(250, 250).write(targetPath);
        fs.unlinkSync(req.file.path);
        await User.findByIdAndUpdate(req.user._id, { avatarURL: `/avatars/${filename}` });
        res.status(200).json({ avatarURL: `/avatars/${filename}` });
    } catch (error) {
        res.status(500).json({ message: 'Avatar upload failed.' });
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    avatarUpdate
};
