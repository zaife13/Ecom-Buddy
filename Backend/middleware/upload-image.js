const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limits: 500000, //500KB,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + '.' + ext);
    },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! will convert the result to true/false
      let error = isValid ? null : new Error('Invalid mime type!');
      cb(error, isValid);
    },
  }),
});

module.exports = fileUpload;
