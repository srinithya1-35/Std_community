import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AcademicCalendar from './components/pages/AcademicCalendar';
import Timetable from './components/pages/Timetable';
import Attendance from './components/pages/Attendance';
import Announcements from './components/pages/Announcements';
import Results from './components/pages/Results';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
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
