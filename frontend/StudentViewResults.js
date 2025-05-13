import React from 'react';

function StudentViewResults({ results }) {
  if (!results || results.length === 0) {
    return <p>No results available at the moment.</p>;
  }

  return (
    <div>
      <h2>View Results</h2>
      {results.map((result) => (
        <div key={result.id}>
          <h3>{result.title}</h3>
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            Download/View Result PDF
          </a>
        </div>
      ))}
    </div>
  );
}

export default StudentViewResults;
