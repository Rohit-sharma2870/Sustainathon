import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  patientCode:{type:String},
  title: { type: String, required: true },
  date: { type: Date, required: true },
  labName: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, required: true },
}, { timestamps: true });
const Record = mongoose.model("Record", recordSchema);
export default Record;
