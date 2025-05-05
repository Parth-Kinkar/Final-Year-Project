import React, { useState, useEffect } from "react";
import "./EditTeacherModal.css"; // ✅ Import modal styling
import axios from "axios";

const EditTeacherModal = ({ isOpen, onClose, teacher, refreshTeachers }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    designation: "",
    specialization: "",
    experience: "",
    subjects_taught: "",
    contact_number: "",
    github: "",
    linkedin: "",
    portfolio: ""
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        full_name: teacher.full_name,
        department: teacher.department,
        designation: teacher.designation,
        specialization: teacher.specialization,
        experience: teacher.experience,
        subjects_taught: teacher.subjects_taught,
        contact_number: teacher.contact_number,
        github: teacher.github,
        linkedin: teacher.linkedin,
        portfolio: teacher.portfolio,
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!teacher?.user?.id) {
    alert("Error: User ID is missing!");
    return;
  }

  try {
    await axios.put(`http://127.0.0.1:8000/auth/teachers/${teacher.user.id}/update/`, formData);  // ✅ Fix: Use user.id
    alert("Teacher details updated successfully!");
    refreshTeachers(); // ✅ Refresh list after update
    onClose(); // ✅ Close modal
  } catch (error) {
    console.error("Error updating teacher:", error);
    alert("Failed to update teacher.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Teacher</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
          <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" />
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
          <input type="text" name="subjects_taught" value={formData.subjects_taught} onChange={handleChange} placeholder="Subjects Taught" />
          <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" />
          <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Profile" />
          <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" />
          <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio Website" />

          <button type="submit" className="save-button">Save Changes</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
