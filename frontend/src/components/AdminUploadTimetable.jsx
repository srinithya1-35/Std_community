import React, { useState } from 'react';

function AdminUploadTimetable() {
  const [title, setTitle] = useState('');
  const [pdf, setPdf] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('pdf', pdf);
    
    try {
      const res = await fetch('/timetable/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setMessage(data.message || 'Upload failed');
    } catch (err) {
      setMessage('Error uploading file.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>Title:</label>
      <input
        type="text"
        placeholder="Enter timetable title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <label>Choose PDF:</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
        required
      />
      
      <button type="submit">Upload</button>
      {message && <div>{message}</div>}
    </form>
  );
}

export default AdminUploadTimetable;
