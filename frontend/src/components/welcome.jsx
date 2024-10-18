// src/components/Welcome.js
import React from 'react';
import { Button, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            College Platform
          </Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
        </Toolbar>
      </AppBar>

      {/* Main Welcome Section */}
      <Container style={{ textAlign: 'center', marginTop: '100px' }}>
        <Typography variant="h2" gutterBottom>Welcome to Our College Platform</Typography>
        <Typography variant="h5" gutterBottom>
          Discover projects, connect with students, teachers, and recruiters.
        </Typography>
        <Button variant="contained" color="primary" size="large" component={Link} to="/login">
          Get Started
        </Button>
      </Container>
    </div>
  );
};

export default Welcome;
