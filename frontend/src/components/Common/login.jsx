import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

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
      localStorage.setItem("user", JSON.stringify(response.data.user));
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
    <div className="login-container">
      <div className="left-panel">
        <h1>Hi</h1>
        <p className="role-text">Choose Your Role</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="role-dropdown"
        >
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">College Admin</option>
          <option value="Recruiter">Recruiter</option>
        </select>
      </div>

      <div className="right-panel">
        <h2 className="welcome-text">Hello Again!</h2>
        <p className="sub-text">Welcome back, you’ve been missed!</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="show-password">SHOW</span>
          </div>

          <p className="recovery-text">Recovery Password</p>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
