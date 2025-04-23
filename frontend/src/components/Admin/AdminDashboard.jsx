import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // Styling for the dashboard
import Navbar from "./Navbar"; // Import Navbar component

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="admin-dashboard-container">
        <h1 className="welcome-message">Welcome to the Admin Dashboard</h1>

        {/* Quick Links Section */}
        <div className="quick-links">
          <div
            className="link-card"
            onClick={() => navigate("/manage-students")}
          >
            <h2>Manage Students</h2>
            <p>Add, Edit, or View all student accounts</p>
          </div>
          <div
            className="link-card"
            onClick={() => navigate("/manage-teachers")}
          >
            <h2>Manage Teachers</h2>
            <p>Add, Edit, or View all teacher accounts</p>
          </div>
          <div
            className="link-card"
            onClick={() => navigate("/manage-departments")}
          >
            <h2>Manage Departments</h2>
            <p>Create, Edit, or Delete departments</p>
          </div>
          <div className="link-card">
            <h2>View Statistics</h2>
            <p>Check overall platform data at a glance</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>XXXX</p>
          </div>
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <p>XXXX</p>
          </div>
          <div className="stat-card">
            <h3>Total Departments</h3>
            <p>XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;