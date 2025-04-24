import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStudents.css"; // Assuming you have a CSS file for styling
import EditStudentModal from "./EditStudentModal";
import Navbar from "./Navbar.jsx"; // Import the Navbar component
import CreateStudentModal from "./CreateStudentModal.jsx";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]); // Store departments
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/auth/students/search/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/auth/students/${userId}/delete/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        alert("Student deleted successfully!");
        fetchStudents(); // 🔄 Refresh list automatically
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
    fetchStudents();  // 🔄 Refresh list after creation
  };

  // Fetch departments dynamically
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
        setDepartments(response.data); // Store department list from API
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch students dynamically with filters
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = {
          search: searchTerm,
          department__id: selectedDepartment || undefined,
          year: selectedYear || undefined,
        };

        const response = await axios.get("http://127.0.0.1:8000/auth/students/search/", { params });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error); 
      }
    };

    fetchStudents();
  }, [searchTerm, selectedDepartment, selectedYear]); // Re-fetch when filters change

  return (
    <div className="manage-students-container">
      <Navbar /> {/* Include the Navbar component */}
      <h1>Manage Students</h1>

      {/* Search and Filters Section */}
      <div className="search-filters-section">
        <input
          type="text"
          placeholder="Search by name, roll number, or email..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filters">
          <select
            className="filter-dropdown"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            className="filter-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">Final Year</option>
          </select>
        </div>
      </div>
      {/* Buttons Section */}
      <div className="buttons-section">
        <button className="action-button" onClick={() => setCreateModalOpen(true)}>Create New Student</button>
        <button className="action-button" >Upload Using Excel</button>
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
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.full_name}</td>
                <td>{student.roll_number}</td>
                <td>{student.year_display || "Unknown"}</td>
                <td>{student.department.name}</td>
                <td>{student.user.email}</td>
                <td>
                  <button className="edit-button" onClick={() => openEditModal(student)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(student.user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    {/* Edit Student Modal */}
      <EditStudentModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} student={selectedStudent} />
      <CreateStudentModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
};

export default ManageStudents;
