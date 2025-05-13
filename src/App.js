import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AcademicCalendar from './components/pages/AcademicCalendar';
import Timetable from './components/pages/Timetable';
import Attendance from './components/pages/Attendance';
import Announcements from './components/pages/Announcements';
import Results from './components/pages/Results';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherAttendance from './components/TeacherAttendance';
import TeacherAttendanceAnalysis from './components/TeacherAttendanceAnalysis';
import StudentAttendanceAnalysis from './components/StudentAttendanceAnalysis';
import AdminUploadTimetable from './components/AdminUploadTimetable';
import StudentViewTimetable from './components/StudentViewTimeTable';
import TeacherUploadResult from './components/TeacherUploadResult';
import StudentViewResults from './components/StudentViewResults';
import AdminUploadCalendar from './components/AdminUploadCalendar;  // New component for uploading calendar
import StudentViewCalendar from './components/StudentViewCalendar;  // New component for viewing calendar

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
function App() {
  const [timetable, setTimetable] = useState(null);
  const [results, setResults] = useState([]);
  const [calendar, setCalendar] = useState(null); // State to store the calendar PDF

  // Fetch timetable and results data for students
  useEffect(() => {
    fetch('/timetable')
      .then((response) => response.json())
      .then((data) => setTimetable(data))
      .catch((err) => console.error('Error fetching timetable:', err));

    fetch('/results')
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((err) => console.error('Error fetching results:', err));

    fetch('/calendar')
      .then((response) => response.json())
      .then((data) => setCalendar(data))
      .catch((err) => console.error('Error fetching calendar:', err));
  }, []);

  return (
 
      <Routes>
        {/* Teacher-related routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-attendance" element={<TeacherAttendance />} />
        <Route path="/teacher-attendance-analysis" element={<TeacherAttendanceAnalysis />} />
        <Route path="/teacher/upload-results" element={<TeacherUploadResult />} />
        
        {/* Student-related routes */}
        <Route path="/student/attendance" element={<StudentAttendanceAnalysis />} />
        <Route
          path="/student/timetable"
          element={<StudentViewTimetable timetable={timetable} />}
        />
        <Route
          path="/student/view-results"
          element={<StudentViewResults results={results} />}
        />
        <Route
          path="/student/view-calendar"
          element={<StudentViewCalendar calendar={calendar} />}  // Route for viewing calendar
        />

        {/* Timetable and Calendar related routes */}
        <Route path="/admin/upload-timetable" element={<AdminUploadTimetable />} />
        <Route path="/admin/upload-calendar" element={<AdminUploadCalendar />} />  {/* Route for uploading calendar */}
   
  

    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic-calendar"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AcademicCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Timetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcement"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Results />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
};

export default App;

