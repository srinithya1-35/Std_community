import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Attendance Dashboard</h2>
      
      <div className="flex flex-col space-y-6 w-full max-w-xs">
        <button
          className="bg-blue-500 text-white text-lg py-4 rounded-xl shadow-md hover:bg-blue-600 transition"
          onClick={() => navigate('/teacher-attendance')}
        >
          📋 Take Attendance
        </button>
        <button
          className="bg-green-500 text-white text-lg py-4 rounded-xl shadow-md hover:bg-green-600 transition"
          onClick={() => navigate('/student-attendance')}
        >
          📊 Attendance Analysis
        </button>
      </div>
    </div>
  );
}
