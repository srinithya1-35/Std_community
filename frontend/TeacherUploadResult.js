import React, { useState } from 'react';

function TeacherUploadResult() {
  const [title, setTitle] = useState('');
  const [pdf, setPdf] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('pdf', pdf);

    try {
      const res = await fetch('/results/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || 'Upload failed');
    } catch (error) {
      setMessage('Error uploading file.');
    }
  };

  return (
    <div className="container">
      <h2>Upload Result PDF</h2>
      <form onSubmit={handleSubmit}>
        <label>Result Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Select PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          required
        />

        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default TeacherUploadResult;
