import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Assuming you already have a Navbar component
import axios from "axios";
import "./ManageDepartments.css"; // Add your styling here

const ManageDepartments = () => {
  const [choices, setChoices] = useState([]); // For department choices
  const [selectedDepartment, setSelectedDepartment] = useState(""); // To track selection
  const [departments, setDepartments] = useState([]); // Existing departments list

  // Fetch department choices for the dropdown
  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/choices/");
        setChoices(response.data); // Store the dropdown options
      } catch (error) {
        console.error("Error fetching department choices:", error);
      }
    }; 

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
        setDepartments(response.data); // Fetch existing departments
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchChoices();
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    const departmentExists = departments.some((dept) => dept.id === id);
    if (!departmentExists) {
      alert("This department doesn't exist in the database.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/auth/departments/${id}/delete/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
        setDepartments(response.data);
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department. Please try again.");
      }
    }
  };
  

  // Handle adding a department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return alert("Please select a department!");

    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/departments/create/",
        { name: selectedDepartment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Add auth if required
        }
      );

      // Refresh department list
      const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
      setDepartments(response.data);

      alert("Department added successfully!");
      setSelectedDepartment(""); // Reset dropdown
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Error adding department. It might already exist.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="manage-departments-container">
        <h1>Manage Departments</h1>

        {/* Add Department Section */}
        <form onSubmit={handleAddDepartment} className="add-department-form">
          <label htmlFor="department-select">Select a Department:</label>
          <select
            id="department-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Choose a Department --
            </option>
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
          <button type="submit">Add Department</button>
        </form>

        {/* Departments Table */}
        <div className="departments-table">
          <h2>Existing Departments</h2>
          <table>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>
                  <button
          className="delete-button"
          onClick={() => handleDelete(dept.id)}
        >
          Delete
        </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;