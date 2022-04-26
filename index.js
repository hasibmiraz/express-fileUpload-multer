import express from 'express';
import multer from 'multer';
import path from 'path';

// File Upload Folder
const UPLOADS_FOLDER = './uploads/';

// define multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

// Multer file upload object
const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
        ? cb(null, true)
        : cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
    } else if (file.fieldname === 'doc') {
      file.mimetype === 'application/pdf'
        ? cb(null, true)
        : cb(new Error('Only .pdf format is allowed'));
    } else {
      cb(new Error('There was an unknown error'));
    }
  },
});

const port = 3000;

const app = express();

app.post(
  '/',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
  ]),
  async (req, res) => {
    res.send('Hello world');
  }
);

app.use((err, req, res, next) => {
  err
    ? err instanceof multer.MulterError
      ? res.status(500).send('There was an upload error!')
      : res.status(500).send(err.message)
    : res.send('success');
});

app.listen(port, console.log(`Listening to port ${port}`));
