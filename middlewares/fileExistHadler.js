const fileExistHandler = (req, res, next) => {
    if (!req?.file) {
        return res.status(400).json({ message: 'Image file reqiured' })
    }
    next();
};

module.exports = fileExistHandler;