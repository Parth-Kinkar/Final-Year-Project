import React, { useEffect, useState } from "react";
import "./StudentProfile.css"; // Create this file later
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [projectsCreated, setProjectsCreated] = useState([]);
  const [projectsContributed, setProjectsContributed] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        console.log(response.data);
        setProjectsCreated(response.data.projects_created || []);
        setProjectsContributed(response.data.projects_worked_on || []);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <div className="student-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={
            user?.profile_photo ||
            "https://cdn-icons-png.flaticon.com/512/147/147144.png"
          }
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h2>{user?.full_name || user?.username}</h2>
          <p className="college">
            📍 {user?.college_name || "SSGMCE, Shegaon"}
          </p>
          <p className="email">📧 {user?.email}</p>
          <p className="contact">📞 {user?.contact_number || "Not provided"}</p>
          <button
            className="edit-btn"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
      {/* Social & External Links */}
      <div className="social-links">
        {user?.github && <a href={user.github} target="_blank">🐙 GitHub</a>}
        {user?.linkedin && <a href={user.linkedin} target="_blank">🔗 LinkedIn</a>}
        {user?.portfolio && <a href={user.portfolio} target="_blank">🌐 Portfolio</a>}
        {user?.resume && (
          <a href={user.resume} download target="_blank">
            📄 Download Resume
          </a>
        )}
      </div>

      {/* Skills & Interests */}
      <div className="skills-section">
        <h3>Skills & Interests</h3>

        {/* Skills */}
        <div className="skills">
          {user?.skills ? (
            user.skills.split(",").map((skill, idx) => (
              <span key={idx} className="tag">
                {skill.trim()}
              </span>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>

        {/* Interests */}
        <div className="interests">
          {user?.interested_technologies ? (
            user.interested_technologies.split(",").map((tech, idx) => (
              <span key={idx} className="tag">
                {tech.trim()}
              </span>
            ))
          ) : (
            <p>No interests added yet.</p>
          )}
        </div>
      </div>

      {/* Projects Created */}
      <div className="projects-section">
        <h3>Projects Created</h3>
        <div className="project-list">
          {projectsCreated.length > 0 ? (
            projectsCreated.map((project) => (
              <div key={project.id} className="project-card">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
              </div>
            ))
          ) : (
            <p>No projects created yet.</p>
          )}
        </div>
      </div>

      {/* Bookmarked Projects
      <div className="projects-section">
        <h3>Bookmarked Projects</h3>
        <div className="project-list">
          {bookmarkedProjects.length > 0 ? (
            bookmarkedProjects.map((project) => (
              <div key={project.id} className="project-card">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <button className="bookmark-btn" onClick={() => toggleBookmark(project.id)}>
                  🔖 {bookmarkedProjects.some((proj) => proj.id === project.id) ? "Remove Bookmark" : "Bookmark"}
                </button>
              </div>
            ))
          ) : (
            <p>No bookmarked projects yet.</p>
          )}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default StudentProfile;
