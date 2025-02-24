import multer from "multer";

export const fileFilter = {
  images: ["image/png", "image/jpeg", "image/jpg"],
};

export const multerHost = (FileType = []) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (FileType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("soory not allow this file type"), false);
    }
  }
  return multer({ storage, fileFilter });
};
