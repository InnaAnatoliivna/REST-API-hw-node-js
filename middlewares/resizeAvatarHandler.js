const jimp = require("jimp");
const fs = require("fs/promises");

const resizeAvatar = async (req, res, next) => {
    const { path } = req.file;
    try {
        const image = await jimp.read(path);
        await image.resize(250, 250);
        // await image.cover(250, 250).write(path);
        await image.writeAsync(path);
        next();
    } catch (error) {
        error.status = 400;
        console.log(error);
        await fs.unlink(path);
        next(error);
    }
};

module.exports = resizeAvatar;