import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
// ✅ Patient Authentication Middleware
export const protectPatient = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await Patient.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Patient not found" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
// ✅ Doctor Authentication Middleware
export const protectDoctor = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Use Mongo _id from token
      req.doctor = await Doctor.findById(decoded.id).select("-password");
      if (!req.doctor) {
        return res.status(401).json({ message: "Doctor not found" });
      }
      next();
    } catch (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
