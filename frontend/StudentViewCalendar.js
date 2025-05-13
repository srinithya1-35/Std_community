import React from 'react';

function StudentViewCalendar({ calendar }) {
  return (
    <div>
      <h2>View Academic Calendar</h2>
      {calendar ? (
        <iframe
          src={`/uploads/${calendar.filename}`} // Adjust this to where the file is hosted
          title="Academic Calendar"
          width="100%"
          height="600px"
        />
      ) : (
        <p>No calendar available</p>
      )}
    </div>
  );
}

export default StudentViewCalendar;
