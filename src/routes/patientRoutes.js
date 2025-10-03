import express from "express";
import {
  registerPatient,
  loginPatient,
  getPatientById,
} from "../controllers/patientcontroller.js";
const router = express.Router();
// Routes
router.post("/signup", registerPatient);
router.post("/login", loginPatient);
router.get("/:id", getPatientById);
export default router;