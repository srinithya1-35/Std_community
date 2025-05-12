import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import TeacherAttendance from './components/TeacherAttendance.jsx';
import TeacherAttendanceAnalysis from './components/TeacherAttendanceAnalysis.jsx';
import StudentAttendanceAnalysis from './components/StudentAttendanceAnalysis.jsx';
import AdminUploadTimetable from './components/AdminUploadTimetable.jsx';
import StudentViewTimetable from './components/StudentViewTimeTable.jsx';
import TeacherUploadResult from './components/TeacherUploadResult.jsx';
import StudentViewResults from './components/StudentViewResults.jsx';
import AdminUploadCalendar from './components/AdminUploadCalendar.jsx';  // New component for uploading calendar
import StudentViewCalendar from './components/StudentViewCalendar.jsx';  // New component for viewing calendar

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
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;
