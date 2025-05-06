import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const sidebarStyle = {
    width: '240px',
    background: '#f0f0f0',
    padding: '20px',
    height: '100vh',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    padding: '12px',
    background: '#fff',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const studentInfoStyle = {
    marginBottom: '20px',
    fontSize: '16px',
  };

  return (
    <div style={sidebarStyle}>
      {/* Student Info */}
      <div style={studentInfoStyle}>
        <h2>👤 NCB_Student</h2>
        <p><strong>Name:</strong> Sowparnika</p>
        <p><strong>Phone No:</strong> 1234567892</p>
        <p><strong>E-mail ID:</strong> student@example.com</p>
      </div>

      {/* Menu */}
      <h3 style={{ marginBottom: '20px' }}>📂 Student Menu</h3>
      <Link to="/academic-calendar" style={linkStyle}>📅 Academic Calendar</Link>
      <Link to="/timetable" style={linkStyle}>🕒 Timetable</Link>
      <Link to="/attendance" style={linkStyle}>✅ Attendance</Link>
      <Link to="/announcement" style={linkStyle}>📢 Announcements</Link>
      <Link to="/results" style={linkStyle}>📊 Results</Link>
    </div>
  );
};

export default Sidebar;
