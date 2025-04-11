import React, { useState } from 'react';

const Login = () => {
  const [uucmsId, setUucmsId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy validation
    if (uucmsId !== 'correctID' || password !== 'correctPassword') {
      setErrorMessage('Invalid UUCMS ID or Password.');
      setUucmsId('');
      setPassword('');
    } else {
      setErrorMessage('');
      console.log('Login successful!');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '30px' }}>Welcome to UniConnect</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uucms_id">UUCMS ID:</label>
          <input
            type="text"
            id="uucms_id"
            value={uucmsId}
            onChange={(e) => setUucmsId(e.target.value)}
            placeholder="Enter UUCMS ID"
            required
            style={{ display: 'block', margin: '10px auto', padding: '8px', width: '250px' }}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            style={{ display: 'block', margin: '10px auto', padding: '8px', width: '250px' }}
          />

          <button
            type="submit"
            style={{ padding: '10px 15px', cursor: 'pointer', marginTop: '10px' }}
          >
            Login
          </button>

          {errorMessage && (
            <div style={{ color: 'red', marginTop: '15px' }}>
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
