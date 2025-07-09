/** @format */

import express from "express";
import {
  createAssignment,
  getAssignmentsForClass,
} from "../controllers/assignmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createAssignment);
router.get("/class/:classId", auth, getAssignmentsForClass);
export default router;
