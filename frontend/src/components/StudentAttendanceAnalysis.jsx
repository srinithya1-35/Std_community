import React, { useEffect, useState } from 'react';

const StudentAttendanceAnalysis = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('student_id');

  useEffect(() => {
    if (!studentId) {
      alert('Not logged in. Please log in first.');
      window.location.href = '/login'; // Adjust your login route
      return;
    }

    fetch(`http://localhost:5000/attendance/analysis/student/${studentId}`)
      .then(res => res.json())
      .then(data => {
        setAttendanceData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
        setAttendanceData([]);
        setLoading(false);
      });
  }, [studentId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>My Attendance Summary</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Total Classes</th>
            <th style={thStyle}>Present</th>
            <th style={thStyle}>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={tdCenter}>Loading...</td></tr>
          ) : attendanceData.length === 0 ? (
            <tr><td colSpan="4" style={tdCenter}>No data found</td></tr>
          ) : (
            attendanceData.map((record, index) => {
              const percent = ((record.present_count / record.total_classes) * 100).toFixed(2);
              return (
                <tr key={index} style={percent < 75 ? lowStyle : {}}>
                  <td style={tdStyle}>{record.subjects_name}</td>
                  <td style={tdStyle}>{record.total_classes}</td>
                  <td style={tdStyle}>{record.present_count}</td>
                  <td style={tdStyle}>{percent}%</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '12px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '12px',
  textAlign: 'left',
};

const tdCenter = {
  textAlign: 'center',
  padding: '12px',
  color: '#555',
};

const lowStyle = {
  backgroundColor: '#ffe6e6',
};

export default StudentAttendanceAnalysis;
