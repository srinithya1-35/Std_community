import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    uucms_id: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.uucms_id || !formData.password) {
        setErrorMessage('Please fill in all fields');
        return false;
      }

      if (userType === 'student') {
        const uucmsRegex = /^U\d{2}EZ\d{2}S\d{3}\d$/;
        if (!uucmsRegex.test(formData.uucms_id)) {
          setErrorMessage('Invalid UUCMS ID format');
          return false;
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.uucms_id)) {
          setErrorMessage('Invalid email format');
          return false;
        }
      }
    } else {
      // Signup validation
      if (userType === 'student') {
        if (!formData.name || !formData.uucms_id || !formData.password || !formData.confirmPassword) {
          setErrorMessage('Please fill in all fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('Passwords do not match');
          return false;
        }
        const uucmsRegex = /^U\d{2}EZ\d{2}S\d{3}\d$/;
        if (!uucmsRegex.test(formData.uucms_id)) {
          setErrorMessage('Invalid UUCMS ID format');
          return false;
        }
      } else {
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
          setErrorMessage('Please fill in all fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('Passwords do not match');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setErrorMessage('Invalid email format');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: formData.uucms_id,
            password: formData.password,
            userType,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setErrorMessage('');
          onLogin();
          navigate('/dashboard');
        } else {
          setErrorMessage(data.error || 'Invalid credentials');
        }
      } else {
        // Signup logic
        const endpoint = userType === 'student' ? '/auth/signup/student' : '/auth/signup/teacher';
        const signupData = userType === 'student' 
          ? {
              name: formData.name,
              uucms_id: formData.uucms_id,
              password: formData.password
            }
          : {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password
            };

        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });

        const data = await response.json();

        if (response.ok) {
          setErrorMessage('');
          setIsLogin(true); // Switch to login form after successful signup
          setFormData({
            name: '',
            uucms_id: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          setErrorMessage(data.error || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (isLogin) {
      return (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="uucms_id" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {userType === 'student' ? 'UUCMS ID:' : 'Email:'}
            </label>
            <input
              type="text"
              id="uucms_id"
              name="uucms_id"
              value={formData.uucms_id}
              onChange={handleInputChange}
              placeholder={userType === 'student' ? 'Enter UUCMS ID' : 'Enter Email'}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          {userType === 'student' ? (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="uucms_id" style={{ display: 'block', marginBottom: '0.5rem' }}>
                UUCMS ID:
              </label>
              <input
                type="text"
                id="uucms_id"
                name="uucms_id"
                value={formData.uucms_id}
                onChange={handleInputChange}
                placeholder="Enter UUCMS ID"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>
          Welcome to UniConnect
        </h1>
        <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '1.5rem' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* User type selection */}
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                value="student"
                checked={userType === 'student'}
                onChange={() => setUserType('student')}
              /> Student
            </label>
            <label>
              <input
                type="radio"
                value="faculty"
                checked={userType === 'faculty'}
                onChange={() => setUserType('faculty')}
              /> Faculty
            </label>
          </div>

          {renderForm()}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
                setFormData({
                  name: '',
                  uucms_id: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4CAF50',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>

          {errorMessage && (
            <div style={{
              color: '#dc3545',
              marginTop: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: '#f8d7da',
              borderRadius: '4px'
            }}>
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
