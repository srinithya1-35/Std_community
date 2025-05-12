import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [date, setDate] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/students').then(res => {
      setStudents(res.data);
      // Initialize all students as Absent by default
      const initialAttendance = {};
      res.data.forEach(st => {
        initialAttendance[st.student_id] = 'Absent';
      });
      setAttendance(initialAttendance);
    });
    axios.get('http://localhost:5000/subjects').then(res => setSubjects(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      date,
      subjects_id: subjectId,
      attendanceData: students.map(s => ({
        student_id: s.student_id,
        status: attendance[s.student_id] || 'Absent'
      }))
    };
    const res = await axios.post('http://localhost:5000/attendance/submit', data);
    alert(res.data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Mark Attendance</h2>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mb-4 block w-full border p-2 rounded" />
      <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required className="mb-6 block w-full border p-2 rounded">
        <option value="">-- Select Subject --</option>
        {subjects.map(sub => (
          <option key={sub.subjects_id} value={sub.subjects_id}>{sub.subjects_name}</option>
        ))}
      </select>

      {students.map(st => (
        <div key={st.student_id} className="mb-6 border rounded p-4 bg-gray-50">
          <div className="font-semibold mb-2">{st.name} ({st.uucms_id})</div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`status-${st.student_id}`}
                value="Present"
                checked={attendance[st.student_id] === 'Present'}
                onChange={() => setAttendance(prev => ({ ...prev, [st.student_id]: 'Present' }))}
              />
              <span className="px-3 py-1 bg-green-500 text-white rounded">Present</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`status-${st.student_id}`}
                value="Absent"
                checked={attendance[st.student_id] === 'Absent'}
                onChange={() => setAttendance(prev => ({ ...prev, [st.student_id]: 'Absent' }))}
              />
              <span className="px-3 py-1 bg-red-500 text-white rounded">Absent</span>
            </label>
          </div>
        </div>
      ))}

      <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Submit Attendance
      </button>
    </form>
  );
}
