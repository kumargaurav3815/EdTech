/** @format */

import AssignmentSubmission from "../models/AssignmentSubmission.js";

export const submitAssignment = async (req, res) => {
  const { assignmentId, classId, answer } = req.body;
  const studentId = req.userId;

  const submission = new AssignmentSubmission({
    assignmentId,
    classId,
    studentId,
    answer,
  });
  await submission.save();

  res.json({ message: "Assignment submitted" });
};
