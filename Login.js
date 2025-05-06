import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the user data to send to the backend
    const userData = { userId, password, userType };

    try {
      // Sending POST request to backend for login
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, clear error message and navigate to dashboard
        setErrorMessage('');
        onLogin(); // Notify parent component that the user has logged in
        navigate('/dashboard'); // Navigate to the dashboard page
      } else {
        // If login fails, display the error message from the backend
        setErrorMessage(data.message || 'Invalid User ID or Password');
        setUserId('');
        setPassword('');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error during login:', error);
      setErrorMessage('Error occurred while logging in.');
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
        {/* User type selection */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="radio"
              value="student"
              checked={userType === 'student'}
              onChange={() => setUserType('student')}
            /> Student
          </label>
          {' '}
          <label>
            <input
              type="radio"
              value="faculty"
              checked={userType === 'faculty'}
              onChange={() => setUserType('faculty')}
            /> Faculty
          </label>
        </div>

        {/* User ID */}
        <label htmlFor="user_id" style={{ display: 'block', marginTop: '20px' }}>
          User ID:
        </label>
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          required
          style={{ width: '250px', padding: '10px', margin: '10px 0' }}
        />

        {/* Password */}
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
