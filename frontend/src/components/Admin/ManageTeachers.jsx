import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageTeachers.css"; // Styling
import Navbar from "./Navbar.jsx"; // ✅ Import Navbar
import EditTeacherModal from "./EditTeacherModal.jsx"; // ✅ Import EditTeacherModal

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ Store departments
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    fetchTeachers();  // ✅ Refresh list after editing
  };

  const fetchTeachers = async () => {
    try {
      const params = {
        search: searchTerm || undefined,
        department: selectedDepartment || undefined,
      };

      const response = await axios.get("http://127.0.0.1:8000/auth/teachers/", { params });
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
        setDepartments(response.data); // ✅ Load department list from API
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // ✅ Fetch teachers dynamically with filters
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const params = {
          search: searchTerm || undefined,
          department: selectedDepartment || undefined,
        };

        const response = await axios.get("http://127.0.0.1:8000/auth/teachers/", { params });
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [searchTerm, selectedDepartment]);

  return (
    <div className="manage-teachers-container">
      <EditTeacherModal isOpen={isEditModalOpen} onClose={closeEditModal} teacher={selectedTeacher} refreshTeachers={fetchTeachers} />
      <Navbar /> {/* ✅ Include Navbar */}
      <h1>Manage Teachers</h1>

      {/* ✅ Search & Filters Section */}
      <div className="search-filters-section">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
      </div>

      {/* ✅ Teachers Table */}
      <div className="teachers-table">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.full_name}</td>
                <td>{teacher.user?.email || "N/A"}</td>
                <td>{teacher.department}</td>
                <td>{teacher.designation}</td>
                <td>{teacher.specialization}</td>
                <td>{teacher.experience} Years</td>
                <td>
                  <button className="edit-button" onClick={() => openEditModal(teacher)}>Edit</button>
                  <button className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeachers;
