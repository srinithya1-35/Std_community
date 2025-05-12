import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserInfo(user);
    }
    setLoading(false);
  }, []);

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

    const userInfoStyle = {
      marginBottom: '20px',
      fontSize: '16px',
      padding: '15px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div style={sidebarStyle}>
        {/* User Info */}
        <div style={userInfoStyle}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>
            {userInfo?.role === 'student' ? '👤 Student Profile' : '👤 Faculty Profile'}
          </h2>
          {userInfo?.role === 'student' ? (
            <>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>UUCMS ID:</strong> {userInfo.uucms_id}</p>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
            </>
          )}
        </div>

        {/* Menu */}
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {userInfo?.role === 'student' ? '📂 Student Menu' : '📂 Faculty Menu'}
        </h3>
        
        {userInfo?.role === 'student' ? (
          <>
            <Link to="/academic-calendar" style={linkStyle}>📅 Academic Calendar</Link>
            <Link to="/timetable" style={linkStyle}>🕒 Timetable</Link>
            <Link to="/attendance" style={linkStyle}>✅ Attendance</Link>
            <Link to="/announcement" style={linkStyle}>📢 Announcements</Link>
            <Link to="/results" style={linkStyle}>📊 Results</Link>
          </>
        ) : (
          <>
            <Link to="/attendance" style={linkStyle}>✅ Take Attendance</Link>
            <Link to="/announcement" style={linkStyle}>📢 Post Announcements</Link>
            <Link to="/results" style={linkStyle}>📊 Manage Results</Link>
            <Link to="/timetable" style={linkStyle}>🕒 Timetable</Link>
            <Link to="/academic-calendar" style={linkStyle}>📅 Academic Calendar</Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '300px', padding: '70px', width: '100%' }}>
        <h1>Welcome to UniConnect</h1>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default Dashboard;
