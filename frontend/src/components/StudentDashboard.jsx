import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import "./StudentDashboard.css";
import { FaUpload, FaRegBookmark } from "react-icons/fa";

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
        const response = await axios.get(
          "http://127.0.0.1:8000/auth/projects/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sortedProjects = response.data.sort(
          (a, b) => b.rating - a.rating
        );
        setTopProjects(sortedProjects.slice(0, 3)); // Top 3 projects

        if (user && user.interested_technologies) {
          // Filter curated projects based on user's interests
          const curatedList = sortedProjects.filter((project) =>
            project.technologies.some((tech) =>
              user.interested_technologies.includes(tech)
            )
          );
          setCuratedProjects(
            curatedList.length > 0 ? curatedList : sortedProjects.slice(3, 7)
          );
        } else {
          // If no preference, show random projects
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
    <div className="dashboard">
      {/* Sidebar */}
      <div className="navbar">This is nav</div>

      <aside className="sidebar">
        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            alt="Profile"
            className="profile-pic"
          />
          <h2>{user?.full_name || user?.username}</h2>
          <p className="location">📍 SSGMCE, Shegaon</p>
          <div className="stats">
            <div>
              <b>28</b>
              <span>Projects</span>
            </div>
          </div>
        </div>

        <div className="top-projects">
          <h3>Top Projects:</h3>
          <br></br>
          <ul>
            {topProjects.length > 0 ? (
              topProjects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {project.title} (⭐ {project.rating})<p>{project.creators}</p>
                </li>
              ))
            ) : (
              <p>No top projects available</p>
            )}
          </ul>
          <a
            href="/"
            className="view-all"
            onClick={() => navigate("/all-projects")}
          >
            View all Projects →
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h2>Home</h2>
          <div className="upload" onClick={() => navigate("/upload-project")}>
            <span>Upload Your Project</span>
            <FaUpload className="upload-icon" />
          </div>
        </div>

        <section className="trending-projects">
          <h3>Trending Projects:</h3>
          <br></br>
          <div className="projects-list">
            {curatedProjects.map((project) => (
              <div
                className="project-card"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                  alt="User"
                  className="avatar"
                />
                <div className="project-info">
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.description}</p>
                  <div className="meta">
                    <span className="project-technologies">
                      💻 {project.technologies}
                    </span>
                    <span className="project-creators">
                      👨‍🎓 {project.creators.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Messages Section */}
      <aside className="messages">
        <h3>Messages</h3>
        <br></br>
        <ul>
          <li>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Alex"
            />
            <span>Alex Manda</span>
            <span className="msg-count">7</span>
          </li>
          <li>
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Laura"
            />
            <span>Laura Santos</span>
            <span className="msg-count">4</span>
          </li>
          <li>
            <img
              src="https://randomuser.me/api/portraits/men/55.jpg"
              alt="Jadon"
            />
            <span>Jadon S.</span>
            <span className="msg-count">1</span>
          </li>
        </ul>
        <a href="/" className="view-all">
          View all →
        </a>
      </aside>
    </div>
  );
};

export default StudentDashboard;
