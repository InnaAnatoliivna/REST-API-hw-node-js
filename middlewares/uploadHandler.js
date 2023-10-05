const multer = require('multer')
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });


module.exports = upload