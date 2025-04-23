import React, { useEffect, useState } from 'react';
import Login from './components/Common/login.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Common/welcome.jsx';
import Signup from './components/Common/signup.jsx';
import StudentDashboard from './components/Students/StudentDashboard.jsx';
import TeacherDashboard from './components/Teachers/TeacherDashboard.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import RecruiterDashboard from './components/Recruiters/RecruiterDashboard.jsx';
import ProjectPage from './components/Common/ProjectPage.jsx';
import UploadProject from './components/Students/UploadProject.jsx';
import ViewAllProjects from './components/Common/AllProjects.jsx';
import StudentProfile from './components/Students/StudentProfile.jsx';
import EditProfile from './components/Students/EditProfile.jsx';
import ManageStudents from './components/Admin/ManageStudents.jsx';
import ManageDepartments from './components/Admin/ManageDepartments.jsx';
import "./App.css";

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
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/all-projects" element={<ViewAllProjects />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/manage-departments" element={<ManageDepartments />} />
      </Routes>
    </Router>
  );
}

export default App;
