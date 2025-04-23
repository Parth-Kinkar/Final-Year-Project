import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProjectPage.css";
import Navbar from "../Students/Navbar";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/projects/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="project-container">
      <Navbar /> {/* Include Navbar component */}
      {/* Project Header */}
      <div className="project-header">
        <h1 className="project-title">{project.title}</h1>
        <span className="project-rating">⭐ {project.rating}/5</span>
      </div>

      {/* Creators */}
      <p className="project-creators">👨‍🎓 Created by: {project.creators.join(", ")}</p>

      {/* Technologies */}
      <p className="project-technologies">
        💻 Technologies: {project.technologies.split(", ").join(" | ")}
      </p>

      {/* Overview */}
      <h2 className="section-title">Overview</h2>
      <p className="project-description">{project.description}</p>

      {/* Installation */}
      <h2 className="section-title">Installation</h2>
      <p className="how-to-run">{project.how_to_run}</p>

      {/* Buttons */}
      <div className="project-buttons">
        <a href={project.repository_link} target="_blank" rel="noopener noreferrer" className="btn">
          View on GitHub
        </a>
        {project.demo_link && (  // ✅ Conditionally render the button
          <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="btn">
            View Demo
          </a>
        )}
      </div>

      {/* Media */}
      <h2 className="section-title">Media</h2>
      {project.screenshots ? (
        <img
          src={project.screenshots}
          alt="Project Screenshot"
          className="project-screenshot"
        />
      ) : (
        <p>No screenshot available.</p>
      )}

      {/* Related Projects */}
      <h2 className="section-title">Related Projects</h2>
      <p>(Related projects will be added here later)</p>
    </div>
  );
};

export default ProjectPage;
