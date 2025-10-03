import Record from "../models/record.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
export const uploadRecord = async (req, res) => {
  try {
    const { title, date, labName, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const result = await cloudinary.uploader.upload(req.file.path,{
      folder: "medichain_records",
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);
    const record = await Record.create({
       patient:req.user.id,
       patientCode:req.user.patientId,
      title,
      date,
      labName,
      description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
    });

    res.status(201).json({
      message: "Record uploaded successfully",
      record,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getPatientRecordsById = async (req, res) => {
  try {
    const user = req.user;
    const { patientId }=req.params;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    // Fetch records from DB
    const records = await Record.find({ patientCode:patientId})
      .populate("patient")
    res.json({ success: true, records:records});
  } catch (err) {
    console.error("❌ Fetch records error:", err);
    res.status(500).json({ error: err.message });
  }
};