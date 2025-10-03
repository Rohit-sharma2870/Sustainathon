import express from "express";
import {
  registerDoctor,
  loginDoctor,
  getDoctorById,
} from "../controllers/doctorcontroller.js";
const router = express.Router();
// Doctor Routes
router.post("/signup", registerDoctor);
router.post("/login", loginDoctor);
router.get("/:id", getDoctorById);
export default router;
