import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

const ProjectPage = () => {
  const { projectId } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/projects/${projectId}/`, { // Use projectId in the URL
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId, token]); // Add projectId to the dependency array

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-page-container">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      {/* ... other project details ... */}
      <p>Creators: {project.creators.join(", ")}</p>
      <p>Technologies: {project.technologies}</p>
      {/* ... more details as needed ... */}
    </div>
  );
};

export default ProjectPage;