// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import custom CSS

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
        username,
        password,
      });
      const { access, user_type } = response.data;
      if (role.toLowerCase() !== user_type.toLowerCase()) {
        setErrorMessage('Selected role does not match your user type.');
        return;
      }
      localStorage.setItem('token', access);
      if (user_type === 'student') {
        navigate('/student-dashboard');
      } else if (user_type === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (user_type === 'admin') {
        navigate('/admin-dashboard');
      } else if (user_type === 'recruiter') {
        navigate('/recruiter-dashboard');
      }
    } catch (error) {
      setErrorMessage('Login failed. Check your username and password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="login-input"
            >
              <option value="">Login as</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="College Admin">College Admin</option>
              <option value="Recruiter">Recruiter</option>
            </select>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
      <div className="background">
        <div className="light light1"></div>
        <div className="light light2"></div>
        <div className="light light3"></div>
        <div className="light light4"></div>
      </div>
    </div>
  );
};

export default Login;
