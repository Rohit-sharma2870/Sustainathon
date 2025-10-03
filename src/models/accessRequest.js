import mongoose from "mongoose";
const accessRequestSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "revoked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AccessRequest = mongoose.model("AccessRequest", accessRequestSchema);
export default AccessRequest;
