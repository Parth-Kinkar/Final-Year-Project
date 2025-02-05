import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

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

    if (token) fetchUserDetails();
  }, [token]);
  return (
    <div className="dashboard-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="profile-section">
          <img src="/path-to-profile-pic.jpg" alt="Profile" className="profile-pic" />
          <h2>{user?.full_name || user?.username}</h2>
          <p>Computer Science</p>
          <p>Projects: 5</p>
        </div>
        <div className="top-projects-section">
          <h3>Top Projects</h3>
          <ul>
            <li>Project 1</li>
            <li>Project 2</li>
            <li>Project 3</li>
          </ul>
          <button>View All Projects</button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="middle-section">
        <div className="upload-section">
          <input type="text" placeholder="Upload your project..." />
          <button>Post</button>
        </div>
        <div className="curated-projects-section">
          <h3>Projects Curated for You</h3>
          <p>Lorem ipsum content here...</p>
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


// // src/components/StudentDashboard.js
// import React from 'react';
// import { useEffect, useState } from "react";
// import axios from "axios";

// const StudentDashboard = () => {
//   const [user, setUser] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/auth/user/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };

//     if (token) fetchUserDetails();
//   }, [token]);

//   return (
//     <div>
//       <h1>Welcome, {user?.full_name || user?.username}!</h1>
//       <p>Email: {user?.email}</p>
//       <p>Role: {user?.user_type}</p>
//     </div>
//   );
// };

// export default StudentDashboard;