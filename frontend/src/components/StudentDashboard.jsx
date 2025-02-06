import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [topProjects, setTopProjects] = useState([]);
  const [curatedProjects, setCuratedProjects] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/projects/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedProjects = response.data.sort((a, b) => b.rating - a.rating);
        setTopProjects(sortedProjects.slice(0, 3));

        if (user && user.interested_technologies) {
          const curatedList = sortedProjects.filter((project) =>
            project.technologies
              .split(", ")
              .some((tech) => user.interested_technologies.includes(tech))
          );
          setCuratedProjects(curatedList.length > 0 ? curatedList : sortedProjects.slice(3, 7));
        } else {
          setCuratedProjects(sortedProjects.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (token) {
      fetchUserDetails();
      fetchProjects();
    }
  }, [token, user]);

  return (
    <div className="dashboard-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="profile-section">
          <img src="/path-to-profile-pic.jpg" alt="Profile" className="profile-pic" />
          <h2>{user?.full_name || user?.username}</h2>
          <p>{user?.department}</p>
          <p>Projects: {topProjects.length}</p>
        </div>
        <div className="top-projects-section">
          <h3>Top Projects</h3>
          <ul>
            {topProjects.length > 0 ? (
              topProjects.map((project) => (
                <li key={project.id} onClick={() => navigate(`/project/${project.id}`)} style={{ cursor: "pointer" }}>
                  {project.title} (⭐ {project.rating})
                </li>
              ))
            ) : (
              <p>No top projects available</p>
            )}
          </ul>
          <button>View All Projects</button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="middle-section">
        <div className="upload-section">
          <button onClick={() => navigate("/upload-project")} className="upload-btn">
            Upload Your Project
          </button>
        </div>

        {/* Projects Curated for You Section */}
        <div className="curated-projects-section">
          <h3>Projects Curated for You</h3>
          <div className="curated-projects-list">
            {curatedProjects.length > 0 ? (
              curatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-tile"
                  onClick={() => navigate(`/project/${project.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.description}</p>
                  <div className="project-footer">
                    <span className="project-creators">👨‍🎓 {project.creators.join(", ")}</span>
                    <span className="project-technologies">💻 {project.technologies}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No curated projects available</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h3>Recent Conversations</h3>
        <ul>
          <li>Chat with Teacher A</li>
          <li>Chat with Student B</li>
          <li>Chat with Team C</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
