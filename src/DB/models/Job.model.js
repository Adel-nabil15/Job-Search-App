import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  { 
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: ["onsite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["part-time", "full-time"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["CTO", "Team-Lead", "Senior", "Mid-Level", "fresh", "Junior"],
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companys",
      required: true,
    },
  },
  { timestamps: true , toJSON : {virtuals:true},toObject: { virtuals: true } }
);
JobSchema.virtual("CV",{
  ref:"App",
  localField:"_id",
  foreignField:"jobId"
})


const JobModel = mongoose.model("Job", JobSchema);
export default JobModel;
 