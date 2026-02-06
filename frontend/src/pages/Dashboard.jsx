import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/layout.css";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadComplaints = async () => {
    const data = await apiRequest("/api/complaints/my", "GET", null, token);
    setComplaints(data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const submitComplaint = async (e) => {
    e.preventDefault();

    await apiRequest(
      "/api/complaints",
      "POST",
      { title, description },
      token
    );

    setTitle("");
    setDescription("");
    loadComplaints();
  };

  const cancelComplaint = async (id) => {
    await apiRequest(`/api/complaints/${id}`, "DELETE", null, token);
    loadComplaints();
  };

  return (
    <>
      {/* FULL WIDTH */}
      <Navbar />

      {/* CENTERED CONTENT */}
      <div className="page-container">
        <div className="dashboard-header">
          <h2>User Dashboard</h2>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="card">
          <h3>Create Complaint</h3>

          <form onSubmit={submitComplaint} className="complaint-form">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="card">
          <h3>Your Complaints</h3>

          {complaints.length === 0 && <p>No complaints yet.</p>}

          {complaints.map((c) => (
            <div key={c._id} className="complaint-item">
              <h4>{c.title}</h4>
              <p>{c.description}</p>

              <span className={`status ${c.status}`}>
                {c.status}
              </span>

              {c.status === "pending" && (
                <button
                  className="cancel-btn"
                  onClick={() => cancelComplaint(c._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
