import mongoose from "mongoose";
import { FileSchema } from "../../utils/enumTypes.js";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfEmployees: {
      type: String,
      enum: ["1-10", "11-20", "21-50", "51-100", "101-500", "500+"],
      required: true,
    },
    companyEmail: {
      type: String, 
      required: true,
      unique: true,
      trim: true,
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Logo: FileSchema,
    CoverPic : FileSchema,
    HRs: [ 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: Date,
    deletedAt: Date,
    FreazeCompany:{
      type : Boolean,
      default :false
    },
    legalAttachment: FileSchema, 
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true , toJSON : {virtuals : true} }
);

CompanySchema.virtual("Jobs",{
  ref:"Job",
  localField:"_id",
  foreignField:"companyId"
})

const CompanyModel = mongoose.model("companys", CompanySchema);
export default CompanyModel;
