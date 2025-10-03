import express from "express";
import { uploadRecord ,getPatientRecordsById} from "../controllers/recordcontroller.js";
import { protectPatient } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();
router.post("/upload",protectPatient,upload.single("file"), uploadRecord);
router.get("/getrecord",protectPatient,getPatientRecordsById);
export default router;
