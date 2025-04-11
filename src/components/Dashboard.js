import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>DSCE</h2>
      <p><strong>Name:</strong> students</p>
      <p><strong>Phone No:</strong> **********</p>
      <p><strong>E-mail ID:</strong> student@example.com</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', maxWidth: '600px' }}>
        <p><strong>Branch:</strong> IS</p>
        <p><strong>Sem:</strong> 6</p>
        <p><strong>Division:</strong> IS - 6 - C</p>
        <p><strong>Roll No:</strong> 138</p>
        <p><strong>Batch:</strong> C1</p>
      </div>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
        {[
          'Academic Calendar', 'Timetable', 'Attendance',
         'Announcement', 'Results'

        ].map((item, index) => (
          <div key={index} style={{
            backgroundColor: '#f2f2f2',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
