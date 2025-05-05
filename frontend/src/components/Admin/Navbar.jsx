import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState(""); // User input
    const [profiles, setProfiles] = useState([]); // Matching profiles
    const [projects, setProjects] = useState([]); // Matching projects
    const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown
    const navigate = useNavigate();
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
          setShowDropdown(false); // Hide dropdown for empty input
          return;
        }
    
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/auth/search/?q=${query}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          console.log(response.data); // Log the response data for debugging
          setProfiles(response.data.profiles); // Update profiles
          setProjects(response.data.projects); // Update projects
          setShowDropdown(true); // Show dropdown
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
    

      return (
        <nav className="navbar">
          {/* Left Section: Logo */}
          <div className="navbar-left" onClick={() => navigate("/admin-dashboard")}>
            <img
              src={`${process.env.PUBLIC_URL}/ProjectPulse logo.png`}
              alt="ProjectPulse Logo"
              className="logo"
            />
          </div>
    
          {/* Middle Section: Search Bar */}
          <div className="navbar-center">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search projects, students, or technologies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Delay for click handling
              />
              
    
              {/* Dropdown Suggestions */}
              {showDropdown && (
                <div className="search-dropdown">
                  {/* Profiles Section */}
                  <div className="dropdown-section">
                    <h4>Matching Profiles</h4>
                    {profiles.length > 0 ? (
                      profiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="dropdown-item"
                          onClick={() => navigate(`/student-profile/${profile.id}`)}
                        >
                          <img
                            src={
                              profile.profile_photo ||
                              "https://cdn-icons-png.flaticon.com/512/147/147144.png"
                            }
                            alt={profile.full_name}
                            className="dropdown-img"
                          />
                          <span>{profile.full_name}</span>
                        </div>
                      ))
                    ) : (
                      <p>No matching profiles found</p>
                    )}
                  </div>
    
                  {/* Projects Section */}
                  <div className="dropdown-section">
                    <h4>Matching Projects</h4>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <div
                          key={project.id}
                          className="dropdown-item"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <span>{project.title}</span>
                        </div>
                      ))
                    ) : (
                      <p>No matching projects found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
    
          {/* Right Section: Profile and Logout */}
          <div className="navbar-right">
          <span className="profile-link" onClick={() => navigate("/all-projects")}>
              Projects
            </span>
            <span className="profile-link" onClick={() => navigate("/student-profile")}>
              Profile
            </span>
            <span className="logout-link" onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
              Logout
            </span>
          </div>
        </nav>
      );
    };
    
    export default Navbar;
    