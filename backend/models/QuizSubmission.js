/** @format */

import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  score: Number,
  answers: [Number],
  submittedAt: { type: Date, default: Date.now },
});

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);
export default QuizSubmission;
