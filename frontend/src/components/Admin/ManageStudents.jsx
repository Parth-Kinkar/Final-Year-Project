import React from "react";
import Navbar from "./Navbar"; // Navbar component
import "./ManageStudents.css"; // Styling for the page

const ManageStudents = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="manage-students-container">
        <h1>Manage Students</h1>

        {/* Search and Filters Section */}
        <div className="search-filters-section">
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
            className="search-bar"
          />

          <div className="filters">
            <select className="filter-dropdown">
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="ETC">ETC</option>
            </select>

            <select className="filter-dropdown">
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="buttons-section">
          <button className="action-button">Add Student</button>
          <button className="action-button">Bulk CSV Upload</button>
        </div>

        {/* Students Table */}
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Year</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>12345</td>
                <td>1</td>
                <td>CSE</td>
                <td>johndoe@example.com</td>
                <td>
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </td>
              </tr>
              {/* Add more rows here as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;