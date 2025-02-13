import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllProjects.css";

const ViewAllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [years] = useState([1, 2, 3, 4]);
  const [technologies, setTechnologies] = useState([]);
  const [filters, setFilters] = useState({ department: "", year: "", technology: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/projects/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/auth/departments/").then((response) => {
      setDepartments(response.data);
    });
    // axios.get("http://127.0.0.1:8000/auth/technologies/").then((response) => {
    //   setTechnologies(response.data);
    // });
  }, []);
  const departmentNames = {
    1: "CSE",
    2: "EE",
    3: "ME",
    4: "CE",
    5: "ETC"
};

  const filteredProjects = projects
    .filter((project) => project.title.toLowerCase().includes(search.toLowerCase()))
    .filter((project) => (filters.department ? departmentNames[project.department] === filters.department : true))
    .filter((project) => (filters.year ? project.year === filters.year : true))
    .filter((project) => (filters.technology ? project.technologies.includes(filters.technology) : true))
    .sort((a, b) => b.rating - a.rating);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="view-projects-container">
      <h1>All Projects</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search by project name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <select onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select onChange={(e) => setFilters({ ...filters, technology: e.target.value })}>
          <option value="">All Technologies</option>
          {technologies.map((tech, index) => (
            <option key={index} value={tech}>{tech}</option>
          ))}
        </select>
      </div>
      <div className="projects-list">
        {currentProjects.map((project) => (
          <div key={project.id} className="project-tile">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
      <ul className="pagination">
        <li>
          <a href="#" onClick={() => handlePageChange(currentPage - 1)}>&lt;</a>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i + 1} className={currentPage === i + 1 ? "active" : ""}>
            <a href="#" onClick={() => handlePageChange(i + 1)}>{i + 1}</a>
          </li>
        ))}
        <li>
          <a href="#" onClick={() => handlePageChange(currentPage + 1)}>&gt;</a>
        </li>
      </ul>
    </div>
  );
};

export default ViewAllProjects;
