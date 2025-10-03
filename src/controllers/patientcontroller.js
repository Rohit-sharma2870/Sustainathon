import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

// =========================================================
// ✅ Register a new patient
// =========================================================
export const registerPatient = async (req, res) => {
  try {
    const {
      name,
      address,
      emergencyContact,
      email,
      phone,
      dob,
      gender,
      insuranceId,
      avatar,
      password,
    } = req.body;

    // Check if email or insuranceId already exists
    const existingPatient = await Patient.findOne({
      $or: [{ email }, { insuranceId }],
    });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient with this email or insurance ID already exists" });
    }

    // Create new patient
    const patient = await Patient.create({
      name,
      address,
      emergencyContact,
      email,
      phone,
      dob,
      gender,
      insuranceId,
      avatar,
      password,
    });

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        patientId: patient.patientId, // your custom ID
      },
    });
  } catch (err) {
    console.error("❌ Patient Signup Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================================================
// ✅ Login Patient
// =========================================================
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await patient.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: patient._id, email: patient.email, patientId: patient.patientId },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        patientId: patient.patientId,
      },
    });
  } catch (err) {
    console.error("❌ Patient Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================================================
// ✅ Get Patient Profile by ID
// =========================================================
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    console.error("❌ Get Patient Profile Error:", err);
    res.status(500).json({ message: err.message });
  }
};
