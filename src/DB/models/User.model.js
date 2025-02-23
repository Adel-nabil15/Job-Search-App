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
    bannedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: Date,
    profilePic: {
      public_id: String,
      secure_url: String,
    },
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
UserSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function async(next) {
  if (this.password) {
    this.password = await HASH({ key: this.password, saltOrRounds: 8 });
  }
  next();
});
UserSchema.pre("save", async function async(next) {
  if (this.mobileNumber) {
    this.mobileNumber = await ENCRYPT({
      key: this.mobileNumber,
      SekretKey: process.env.PHONE_SEKRIT,
    });
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
