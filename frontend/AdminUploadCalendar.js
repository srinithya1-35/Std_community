import React, { useState } from 'react';

function AdminUploadCalendar() {
  const [title, setTitle] = useState('');
  const [calendarFile, setCalendarFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('calendar', calendarFile);

    const res = await fetch('/calendar/upload', {
      method: 'POST',
      body: formData,
    });

    const text = await res.text();
    alert(text); // Show success message or error
  };

  return (
    <div>
      <h2>Upload Academic Calendar (PDF)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Calendar Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          type="file"
          name="calendar"
          accept="application/pdf"
          onChange={(e) => setCalendarFile(e.target.files[0])}
          required
        />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default AdminUploadCalendar;
