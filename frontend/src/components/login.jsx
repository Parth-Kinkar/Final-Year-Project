// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); 

  const [username, setUsername] = useState(''); // Username field
  const [password, setPassword] = useState(''); // Password field
  const [role, setRole] = useState(''); // Role field
  const [errorMessage, setErrorMessage] = useState(''); // Error message

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Send POST request to Django backend for login
      console.log(username, password)
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
        username,
        password
      });

      // Get JWT token from the response
      const { access, user_type } = response.data;

      // Check if the role from form matches the user_type from backend
      if (role.toLowerCase() !== user_type.toLowerCase()) {
        setErrorMessage('Selected role does not match your user type.');
        return;
      }

      // Store JWT token in localStorage
      localStorage.setItem('token', access);

      // Navigate to the appropriate dashboard based on role
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
      // Handle errors from the backend
      setErrorMessage('Login failed. Check your username and password.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username field */}
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password field */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Dropdown */}
          <TextField
            select
            fullWidth
            label="Login as"
            variant="outlined"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Teacher">Teacher</MenuItem>
            <MenuItem value="College Admin">College Admin</MenuItem>
            <MenuItem value="Recruiter">Recruiter</MenuItem>
          </TextField>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
