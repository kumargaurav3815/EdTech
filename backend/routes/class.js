/** @format */

import express from "express";
import {
  createClass,
  getMyClasses,
  getClassById,
  getAllClasses,
  enrollInClass,
  getStudentClasses,
  getClassDetails,
  deleteClass,
  updateClass,
} from "../controllers/classController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", auth, getAllClasses);
router.get("/mine", auth, getStudentClasses);
router.get("/:id/details", auth, getClassDetails);
router.get("/my-classes", auth, getMyClasses);
router.get("/my", auth, getMyClasses);
router.post("/create", auth, createClass);
router.post("/enroll", auth, enrollInClass);
router.delete("/:id", auth, deleteClass);
router.put("/:id", auth, updateClass);
router.get("/:id", auth, getClassById);

export default router;
