/** @format */

import express from "express";
import { submitQuiz } from "../controllers/quizSubmissionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/submit", auth, submitQuiz);

export default router;
