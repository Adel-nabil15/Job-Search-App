import mongoose from "mongoose";
import {
  FileSchema,
  GenderTypes,
  OTPtypes,
  ProviderTypes,
  RoleTypes,
} from "../../utils/enumTypes.js";
import { HASH } from "../../utils/Hash/hach.js";
import { ENCRYPT } from "../../utils/Crypto/encrypt.js";
import { DECRYPT } from "../../utils/Crypto/decrypt.js";

// ------------ UserSchema ------------
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderTypes),
      default: ProviderTypes.SYSTEM,
    },
    gender: {
      type: String,
      enum: Object.values(GenderTypes),
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(RoleTypes),
      default: RoleTypes.USER,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    FreazUser: {
      type: Boolean,
      default: false,
    },
    bannedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: Date,
    profilePic: FileSchema,
    coverPic: FileSchema,
    OTP: [
      {
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(OTPtypes), required: true },
        expiresIn: { type: Date },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual("company", {
  ref: "companys",
  localField: "_id",
  foreignField: "CreatedBy",
});

// -------------- userName virtial ---------------------------------
UserSchema.virtual("username").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

// -------------- hashPasssword by Hooks ----------------------------
UserSchema.pre("save", async function async(next) {
  if (this.password) {
    this.password = await HASH({ key: this.password, saltOrRounds: 8 });
  }
  next();
});

// -------------- decrypt mobileNumber by Hooks ----------------------
UserSchema.post("findOne", async function (doc, next) {
  if (!doc) return next();
  if (doc.mobileNumber) {
    doc.mobileNumber = await DECRYPT({
      cipherKey: doc.mobileNumber,
      SekretKey: process.env.PHONE_SEKRIT,
    });
  }
  next();
});

// -------------- encrypt tmobileNumber by Hooks ----------------------
UserSchema.pre("save", async function async(next) {
  if (this.mobileNumber) {
    this.mobileNumber = await ENCRYPT({
      key: this.mobileNumber,
      SekretKey: process.env.PHONE_SEKRIT,
    });
  }
  next();
});

// -------------- delete every thing //i do task  but i use softDelete not  findOneAndDelete ----------------------
UserSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (!user) return next();
  await mongoose.model("companys").deleteMany({ CreatedBy: user._id });
  next();
});
// ------------ UserModel ------------
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
