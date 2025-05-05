import React, { useState } from "react";
import "./UploadExcelModal.css"; // CSS for styling
import axios from "axios";
import { useEffect } from "react";

const UploadExcelModal = ({ isOpen, onClose }) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]); // Store departments
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewStudents, setPreviewStudents] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/auth/departments/"
        );
        setDepartments(response.data); // Store department list from API
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDownloadTemplate = () => {
    window.location.href = "http://127.0.0.1:8000/auth/download-excel/";
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // ✅ Store selected file
  };
  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", selectedFile);
    formData.append("year", selectedYear);
    formData.append("department_id", selectedDepartment);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/upload-excel/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPreviewStudents(response.data.students); // ✅ Store preview data for display
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        "Failed to process the file. Please check the format and try again."
      );
    }
  };
  const handleConfirmUpload = async () => {
    if (previewStudents.length === 0) {
      alert("No students to confirm.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/confirm-upload/",
        {
          students: previewStudents,
          department_id: selectedDepartment,
          year: selectedYear,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Students added successfully!");
      console.log("Final added students:", response.data.students);

      setPreviewStudents([]); // ✅ Clear preview after adding
      onClose(); // ✅ Close modal after confirmation
    } catch (error) {
      console.error("Error confirming student addition:", error);
      alert("Failed to add students. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bulk Student Upload</h2>
        <form>
          {/* Year Selection */}
          <label>Choose Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            required
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">Final Year</option>
          </select>

          {/* Department Selection */}
          <label>Choose Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleDownloadTemplate}>
            Download Excel Template
          </button>

          {/* File Upload Input ✅ */}
          <label>Upload Filled Excel File:</label>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <button type="button" onClick={handleUploadFile}>
            Upload File
          </button>
        </form>
        {/* Show Preview Table if Data Exists */}
        {previewStudents.length > 0 && (
          <div className="preview-section">
            <h3>Preview Uploaded Students</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll Number</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {previewStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.roll_number}</td>
                    <td>{student.username}</td>
                    <td>{student.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Confirmation Button to Actually Store Students in DB */}
            <button type="button" onClick={handleConfirmUpload}>
              Confirm & Add Students
            </button>
          </div>
        )}
        <button type="button" onClick={onClose} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadExcelModal;
