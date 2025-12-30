const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },

  filename: (req, file, cb) => {
    const Filename = Date.now() + Math.random();
    const ext = path.extname(file.originalname);

    const ValidType = ["image/jpg", "image/jpeg", "image/png"];
    // const ValidType = [".jpg", ".jpeg", ".png"];

    if (ValidType.includes(file.mimetype)) {
      // ==> includes(ext) ✅
      cb(null, `${Filename}${ext}`);
    } else {
      cb(
        new Error(
          "Please select the file according to the desired types. [ jpg | jepg | png ]"
        )
      );
    }
  },
});

const maxsize = 3 * 1000 * 1000;
const upload = multer({
  storage,
  limits: {
    fileSize: maxsize,
  },
});

module.exports = upload;
