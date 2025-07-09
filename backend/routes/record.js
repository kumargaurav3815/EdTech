/** @format */

// routes/recordRoutes.js
import express from "express";
import {
  getAllStudents,
  getStudentDetails,
  getStudentRecordForTeacher,
} from "../controllers/recordController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/teacher", auth, getAllStudents);
router.get("/teacher/details/:id", auth, getStudentDetails); // ✅ changed
router.get("/teacher/records/:id", auth, getStudentRecordForTeacher); // ✅ changed

export default router;
