import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css"; // We'll create this later
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming you have a Navbar component

const EditProfile = () => {
  const [user, setUser] = useState(null); // User info state
  const [resumeFile, setResumeFile] = useState(null); // For handling resume uploads
  const token = localStorage.getItem("token"); // Retrieve token from storage
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details on load
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [token]);

  const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]); // Save the selected file in state
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Prepare form data for sending resume (if updated)
      const formData = new FormData();
      formData.append("full_name", user.full_name);
      formData.append("email", user.email);
      formData.append("contact_number", user.contact_number);
      formData.append("github", user.github);
      formData.append("linkedin", user.linkedin);
      formData.append("portfolio", user.portfolio);
      formData.append("skills", user.skills);
      formData.append("interested_technologies", user.interested_technologies);

      if (resumeFile) {
        formData.append("resume", resumeFile); // Append resume only if uploaded
      }

      await axios.put("http://127.0.0.1:8000/auth/user/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // For handling file uploads
        },
      });

      alert("Profile updated successfully!");
      navigate("/student-profile"); // Redirect after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  return (
    <div className="edit-profile-container">
      <Navbar /> {/* Include Navbar for navigation */}
      <h2>Edit Profile</h2>

      {/* Profile Picture Section */}
      <div className="profile-picture-section">
        <h3>Profile Picture</h3>
        <div className="profile-picture">
          <img
            src={
              user?.profile_photo ||
              "https://cdn-icons-png.flaticon.com/512/147/147144.png"
            }
            alt="Profile"
          />
          <input type="file" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave}>
        {/* Basic Info */}
        <div className="section basic-info">
          <h3>Basic Info</h3>
          <label>
            Full Name
            <input
              type="text"
              value={user?.full_name || ""}
              onChange={(e) =>
                setUser({ ...user, full_name: e.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={user?.email || ""}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          </label>
        </div>

        {/* Contact Info */}
        <div className="section contact-info">
          <h3>Contact Info</h3>
          <label>
            Contact Number
            <input
              type="text"
              value={user?.contact_number || ""}
              onChange={(e) =>
                setUser({ ...user, contact_number: e.target.value })
              }
            />
          </label>
        </div>

        {/* Skills & Interests */}
        <div className="section skills-interests">
          <h3>Skills & Interests</h3>
          <label>
            Skills
            <input
              type="text"
              value={user?.skills || ""}
              onChange={(e) =>
                setUser({ ...user, skills: e.target.value })
              }
            />
          </label>
          <label>
            Interested Technologies
            <input
              type="text"
              value={user?.interested_technologies || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  interested_technologies: e.target.value,
                })
              }
            />
          </label>
        </div>

        {/* Social Links */}
        <div className="section social-links">
          <h3>Social Links</h3>
          <label>
            GitHub
            <input
              type="url"
              value={user?.github || ""}
              onChange={(e) =>
                setUser({ ...user, github: e.target.value })
              }
            />
          </label>
          <label>
            LinkedIn
            <input
              type="url"
              value={user?.linkedin || ""}
              onChange={(e) =>
                setUser({ ...user, linkedin: e.target.value })
              }
            />
          </label>
          <label>
            Portfolio
            <input
              type="url"
              value={user?.portfolio || ""}
              onChange={(e) =>
                setUser({ ...user, portfolio: e.target.value })
              }
            />
          </label>
        </div>

        {/* Resume Upload */}
        <div className="section resume-upload">
          <h3>Upload Resume</h3>
          <label>
            Current Resume:{" "}
            {user?.resume ? (
              <a href={user.resume} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            ) : (
              "No resume uploaded"
            )}
          </label>
          <input type="file" onChange={handleResumeUpload} />
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;