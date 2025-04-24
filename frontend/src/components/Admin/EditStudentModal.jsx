import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditStudentModal.css"; // Ensure this file has basic modal styling

const EditStudentModal = ({ isOpen, onClose, student }) => {
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  // Load department options from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Populate form with student data when modal opens
  useEffect(() => {
    if (student) {
      setFullName(student.full_name);
      setRollNumber(student.roll_number);
      setEmail(student.user.email);
      setSelectedYear(student.year);
      setSelectedDepartment(student.department?.id || "");
    }
  }, [student]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const payload = {
      user_id: student.user.id,  // Send user ID instead of nested object
      full_name: fullName,
      roll_number: rollNumber,
      email,
      year: selectedYear,
      department_id: selectedDepartment, // Send department ID
    };
  
    try {
      await axios.put(`http://127.0.0.1:8000/auth/students/${student.user.id}/update/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      alert("Student updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating student:", error.response?.data || error);
      alert("Failed to update student.");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Student</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            required
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">Final Year</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <button type="submit">Update</button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
