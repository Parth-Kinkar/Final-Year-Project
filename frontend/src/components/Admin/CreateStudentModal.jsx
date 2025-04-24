import React, { useState } from "react";
import axios from "axios";

const CreateStudentModal = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/students/create/", {
        full_name: fullName,
        email,
        roll_number: rollNumber,
        year: selectedYear,
        department: selectedDepartment,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert(`Student created!\nUsername: ${response.data.username}\nPassword: ${response.data.password}`);
      onClose(); // Close modal and refresh list
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Student</h2>
        <form onSubmit={handleCreateStudent}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} required>
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">Final Year</option>
          </select>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required>
            <option value="">Select Department</option>
            {/* Dynamically populate department options from API */}
          </select>
          <button type="submit">Create Student</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentModal;
