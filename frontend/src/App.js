import React, { useEffect, useState } from 'react';
import Login from './components/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/welcome';
import Signup from './components/signup';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import RecruiterDashboard from './components/RecruiterDashboard.jsx';
import ProjectPage from './components/ProjectPage';

function App() {
  const [message, setMessage] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
