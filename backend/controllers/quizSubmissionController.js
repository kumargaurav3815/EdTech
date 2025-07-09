/** @format */

import QuizSubmission from "../models/QuizSubmission.js";
import Quiz from "../models/Quiz.js";

export const submitQuiz = async (req, res) => {
  const { quizId, classId, answers } = req.body;
  const studentId = req.userId;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  // Simple scoring logic
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (q.correct === answers[i]) score++;
  });

  const submission = new QuizSubmission({
    quizId,
    classId,
    studentId,
    answers,
    score,
  });
  await submission.save();

  res.json({ message: "Quiz submitted", score });
};
