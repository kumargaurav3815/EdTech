/** @format */

// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  enrolledClasses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Class",
    default: [],
  },
});
const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
