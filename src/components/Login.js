import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [uucmsId, setUucmsId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login check
    if (uucmsId === 'U18EZ22S001' && password === '1234') {
      setErrorMessage('');
      navigate('/dashboard'); // Navigate to dashboard
    } else {
      setErrorMessage('Invalid UUCMS ID or Password');
      setUucmsId('');
      setPassword('');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Welcome to UniConnect</h1>
      <h2 style={{ marginTop: '10px' }}>Login</h2>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <label htmlFor="uucms_id" style={{ display: 'block', marginTop: '20px' }}>
          UUCMS ID:
        </label>
        <input
          type="text"
          id="uucms_id"
          value={uucmsId}
          onChange={(e) => setUucmsId(e.target.value)}
          placeholder="Enter UUCMS ID"
          required
          style={{ width: '250px', padding: '10px', margin: '10px 0' }}
        />

        <label htmlFor="password" style={{ display: 'block' }}>
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
          style={{ width: '250px', padding: '10px', margin: '10px 0' }}
        />

        <br />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        {errorMessage && (
          <div style={{ color: 'red', marginTop: '15px' }}>{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default Login;
