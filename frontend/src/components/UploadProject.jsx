import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadProject.css";

const UploadProject = () => {
  const [years] = useState([
    "First Year",
    "Second Year",
    "Third Year",
    "Final Year",
  ]);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    year: "",
    department: "",
    creators: [],
    title: "",
    description: "",
    technologies: "",
    how_to_run: "",
    repository_link: "",
    demo_link: "",
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/auth/departments/").then((response) => {
      setDepartments(response.data);
    });
  }, []);

  useEffect(() => {
    if (formData.year && formData.department) {
      const token = localStorage.getItem("token"); // Assuming you store JWT token in localStorage

      axios
        .get(
          `http://127.0.0.1:8000/auth/students/filter/?year=${formData.year}&department=${formData.department}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token here
            },
          }
        )
        .then((response) => {
          setStudents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    }
  }, [formData.year, formData.department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = new FormData();
    console.log(formData);
    Object.keys(formData).forEach((key) => {
      if (key === "creators") {
        formData[key].forEach((creator) =>
          projectData.append("creators", creator)
        );
      } else {
        projectData.append(key, formData[key]);
      }
    });

    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/projects/create/",
        projectData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Project uploaded successfully!");
    } catch (error) {
      console.error("Error uploading project:", error);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload a Project</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Project Details</h2>
          <label>
            Year:
            <select
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Final Year</option>
            </select>
          </label>

          <label>
            Department:
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>

          <label>Creators:</label>
          {students.map((student) => (
            <div key={student.user.id}>
              <input
                type="checkbox"
                value={student.user.id}
                checked={formData.creators.includes(student.user.id)}
                onChange={(e) => {
                  const selectedCreators = formData.creators.includes(
                    student.user.id
                  )
                    ? formData.creators.filter((id) => id !== student.user.id) // Remove if already selected
                    : [...formData.creators, student.user.id]; // Add if not selected
                  setFormData({ ...formData, creators: selectedCreators });
                }}
              />
              <label>{student.user.username}</label>
            </div>
          ))}

          <label>
            Project Title:{" "}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:{" "}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Technologies Used:{" "}
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
            />
          </label>
        </section>

        <section>
          <h2>Installation and Usage</h2>
          <label>
            How to Run Instructions:
            <textarea
              name="how_to_run"
              value={formData.how_to_run}
              onChange={handleChange}
            />
          </label>
        </section>

        <section>
          <h2>Media</h2>
          <label>
            Screenshot:
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, screenshots: e.target.files[0] })
              }
            />
          </label>
        </section>

        <section>
          <h2>Preview Links</h2>
          <label>
            Repository Link:{" "}
            <input
              type="url"
              name="repository_link"
              value={formData.repository_link}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Demo Link (Optional):{" "}
            <input
              type="url"
              name="demo_link"
              value={formData.demo_link}
              onChange={handleChange}
            />
          </label>
        </section>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadProject;
