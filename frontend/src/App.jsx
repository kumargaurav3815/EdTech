/** @format */

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateClass from "./pages/CreateClass";
import ClassRoom from "./pages/ClassRoom";
import CreateQuiz from "./pages/CreateQuiz";
import PrivateRoute from "./components/PrivateRoute";
import CreateAssignment from "./pages/CreateAssignment";
import OpenClass from "./pages/OpenClass";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AvailableClasses from "./pages/AvailableClasses";
import Register from "./pages/Register";
import RedirectDashboard from "./pages/RedirectDashboard";
import StudentClassDetails from "./pages/StudentClassDetails";
import EditClass from "./pages/EditClass";
import TeacherRecords from "./pages/TeacherRecords";
import StudentRecords from "./pages/StudentRecords";
import TeacherStudentDetails from "./pages/TeacherStudentDetails";
import ClassAssignments from "./pages/ClassAssignments";
import ClassQuizzes from "./pages/ClassQuizzes";
import StudentLiveClass from "./pages/StudentLiveClass";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redirect" element={<RedirectDashboard />} />
        <Route path="/student/class/:id" element={<StudentClassDetails />} />
        <Route path="/class/:id/edit" element={<EditClass />} />
        <Route
          path="/class/:id/assignments"
          element={
            <PrivateRoute>
              <ClassAssignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/class/:id/quizzes"
          element={
            <PrivateRoute>
              <ClassQuizzes />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/records/:id"
          element={
            <PrivateRoute>
              <TeacherStudentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/records"
          element={
            <PrivateRoute>
              <TeacherRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/records"
          element={
            <PrivateRoute>
              <StudentRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/class/create"
          element={
            <PrivateRoute>
              <CreateClass />
            </PrivateRoute>
          }
        />
        <Route
          path="/class/:id"
          element={
            <PrivateRoute>
              <ClassRoom />
            </PrivateRoute>
          }
        />
        <Route path="/class/:id/live" element={<StudentLiveClass />} />
        <Route
          path="/quiz/create"
          element={
            <PrivateRoute>
              <CreateQuiz />
            </PrivateRoute>
          }
        />

        <Route
          path="/assignment/create"
          element={
            <PrivateRoute>
              <CreateAssignment />
            </PrivateRoute>
          }
        />
        <Route
          path="/class/open"
          element={
            <PrivateRoute>
              <OpenClass />
            </PrivateRoute>
          }
        />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/classes"
          element={
            <PrivateRoute>
              <AvailableClasses />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
