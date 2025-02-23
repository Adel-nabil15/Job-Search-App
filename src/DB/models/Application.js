
import mongoose from "mongoose";

const AppSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AppModel = mongoose.model("App", AppSchema);
export default AppModel;
