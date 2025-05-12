import React from 'react';

function StudentViewTimetable({ timetable }) {
  if (!timetable) {
    return <div>No timetable available.</div>;
  }

  return (
    <div>
      <h2>View Timetable</h2>
      <p>Title: {timetable.title}</p>
      <a href={timetable.url} target="_blank" rel="noopener noreferrer">
        Download/View Timetable PDF
      </a>
    </div>
  );
}

export default StudentViewTimetable;
