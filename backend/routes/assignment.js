/** @format */

import express from "express";
import {
  createAssignment,
  getAssignmentsForClass,
  deleteAssignment,
  uploadAssignmentFile,
} from "../controllers/assignmentController.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer to store with unique name and retain extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// POST /api/assignment/create (with file)
router.post("/create", auth, upload.single("file"), createAssignment);

// GET assignments for a class
router.get("/class/:classId", auth, getAssignmentsForClass);

// DELETE an assignment
router.delete("/:assignmentId/:classId", auth, deleteAssignment);

router.post("/upload", auth, upload.single("file"), uploadAssignmentFile);

export default router;
