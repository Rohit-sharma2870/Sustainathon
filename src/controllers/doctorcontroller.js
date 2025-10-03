import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.js";

// ===================================================
// ✅ Register a new doctor
// ===================================================
export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      hospital,
      email,
      phone,
      dob,
      gender,
      license,
      avatar,
      password,
    } = req.body;

    // Check for existing doctor
    const existingDoctor = await Doctor.findOne({ $or: [{ email }, { license }] });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email or license already exists" });
    }
    const doctor = await Doctor.create({
      name,
      specialization,
      hospital,
      email,
      phone,
      dob,
      gender,
      license,
      avatar,
      password,
    });

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor,
    });
  } catch (err) {
    console.error("Doctor signup error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ===================================================
// ✅ Doctor Login
// ===================================================
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({email});
    if (!doctor)
      return res.status(400).json({ message: "Invalid email or password" });
    const isMatch = await doctor.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    // Create token
    const token = jwt.sign(
      { id:doctor._id, email: doctor.email, doctorId: doctor.doctorId},
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        doctorId: doctor.doctorId,
      },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===================================================
// ✅ Get Doctor by ID
// ===================================================
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    console.error("Get doctor error:", err);
    res.status(500).json({ message: err.message });
  }
};
