import { Router } from "express";
import {
  DeletecoverPic,
  DeleteProfilePic,
  GetProfile,
  getUser,
  SoftDelete,
  UpdatePassword,
  UpdateUser,
  UploadCoverPic,
  UploadProfilPic,
} from "./user.service.js";
import { Authentication } from "../../middleware/Authentcationn.js";
import { Validation } from "../../middleware/Valid.js";
import {
  DeletecoverPicValid,
  DeleteProfilePicValid,
  SoftDeleteValid,
  UpdatePasswodValidation,
  UploadcoverPicValid,
  UploadProfilPicValid,
} from "./user.validate.js";
import { fileFilter, multerHost } from "../../middleware/multer.js";

const UserRouter = Router();

UserRouter.patch("/Update", Authentication, UpdateUser);
UserRouter.get("/getUser", Authentication, getUser);
UserRouter.get("/GetProfile/:userId",GetProfile)
UserRouter.patch(
  "/UpdatePassword",
  Validation(UpdatePasswodValidation),
  Authentication,
  UpdatePassword
);
UserRouter.patch(
  "/UploadProfilPic",
  multerHost(fileFilter.images).single("profilePic"),
  Validation(UploadProfilPicValid),
  Authentication,
  UploadProfilPic
);
UserRouter.patch(
  "/UploadCoverPic",
  multerHost(fileFilter.images).single("CoverPic"),
  Validation(UploadcoverPicValid),
  Authentication,
  UploadCoverPic
);

UserRouter.delete(
  "/DeleteProfilePic",
  Validation(DeleteProfilePicValid),
  Authentication,
  DeleteProfilePic
);

UserRouter.delete(
  "/DeletecoverPic",
  Validation(DeletecoverPicValid),
  Authentication,
  DeletecoverPic
);
UserRouter.delete(
  "/SoftDelete",
  Validation(SoftDeleteValid),
  Authentication,
  SoftDelete
);

export default UserRouter;
 