import React, { useEffect, useState } from 'react';

const AttendanceAnalysis = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: 'all',
    student: '',
    attendance: 'all'
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/attendance/analysis/all');
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAttendanceData(data);
        setFilteredData(data);

        const uniqueSubjects = [...new Set(data.map(item => item.subjects_name))].sort();
        setSubjects(uniqueSubjects);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
        alert('Failed to load attendance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const applyFilters = () => {
    let data = [...attendanceData];
    const { subject, student, attendance } = filters;

    if (subject !== 'all') {
      data = data.filter(item => item.subjects_name === subject);
    }

    if (student.trim()) {
      const query = student.trim().toLowerCase();
      data = data.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.uucms_id.toLowerCase().includes(query)
      );
    }

    if (attendance === 'low') {
      data = data.filter(item => (item.present_count / item.total_classes) * 100 < 75);
    }

    setFilteredData(data);
  };

  const resetFilters = () => {
    setFilters({ subject: 'all', student: '', attendance: 'all' });
    setFilteredData(attendanceData);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Attendance Analysis</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label htmlFor="subject">Subject:</label>
          <select name="subject" value={filters.subject} onChange={handleChange}>
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="student">Student:</label>
          <input
            type="text"
            name="student"
            placeholder="Search by name..."
            value={filters.student}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>

        <div>
          <label htmlFor="attendance">Attendance:</label>
          <select name="attendance" value={filters.attendance} onChange={handleChange}>
            <option value="all">All Students</option>
            <option value="low">Below 75%</option>
          </select>
        </div>

        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={resetFilters}>Reset</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#666' }}>
          Loading attendance data...
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>UUCMS ID</th>
              <th>Subject</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No attendance records found</td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const percentage = ((item.present_count / item.total_classes) * 100).toFixed(2);
                return (
                  <tr key={index} style={{ backgroundColor: percentage < 75 ? '#ffdddd' : '' }}>
                    <td>{item.name}</td>
                    <td>{item.uucms_id}</td>
                    <td>{item.subjects_name}</td>
                    <td>{item.total_classes}</td>
                    <td>{item.present_count}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceAnalysis;
