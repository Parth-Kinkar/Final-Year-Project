import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStudents.css"; // Ensure you have modal styling

const CreateStudentModal = ({ isOpen, onClose, refreshStudents }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments dynamically
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

  // Handle student creation
  const handleCreateStudent = async (e) => {
    e.preventDefault();
  
    // Retrieve user ID from stored authentication data
    const userData = JSON.parse(localStorage.getItem("user"));
    const adminUserId = userData?.id; // Get admin's user ID
  
    if (!adminUserId) {
      alert("Error: Unable to retrieve admin user ID!");
      return;
    }
  
    const payload = {
      full_name: fullName,
      email,
      roll_number: rollNumber, 
      year: selectedYear,
      department_id: selectedDepartment,
      user_id: adminUserId,  // ✅ Now dynamically set
    };
  
    console.log("Sending payload:", payload); // Debugging log
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/students/create/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("API Response:", response.data); // Debugging log
      if (!response.data.username || !response.data.password) {
        console.error("Missing credentials in response!", response.data);
        alert("Error: Login credentials missing in API response!");
        return;
      }
  
      alert(`Student created successfully!\nUsername: ${response.data.username}\nPassword: ${response.data.password}`);
      onClose();
      
    } catch (error) {
      console.error("Error creating student:", error.response?.data || error);
      alert("Failed to create student. Server Response: " + JSON.stringify(error.response?.data));
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
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Student"}</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentModal;
