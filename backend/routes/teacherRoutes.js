/** @format */

// routes/teacherRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import { getTeacherDashboard } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/dashboard", auth, getTeacherDashboard); // GET /api/teacher/dashboard

export default router;
