const jimp = require("jimp");
const fs = require("fs/promises");

const resizeAvatar = async (req, res, next) => {
    const { path } = req.file;
    if (!path) {
        throw new Error('File path is missing.');
    }
    try {
        const image = await jimp.read(path);

        if (image.bitmap) {
            await image.resize(250, 250).writeAsync(path);
            next();
        } else {
            throw new Error('Invalid image content.');
        }

    } catch (error) {
        error.status = 400;
        // console.error('Error resizing avatar:', error.message);
        await fs.unlink(path);
        next(error);
    }
};

module.exports = resizeAvatar;