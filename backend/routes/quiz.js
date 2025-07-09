/** @format */

import express from "express";
import auth from "../middleware/auth.js";
import {
  createQuizzes,
  getQuizzesForClass,
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/:id", auth, getQuizzesForClass);
router.post("/create", auth, createQuizzes);

export default router;
