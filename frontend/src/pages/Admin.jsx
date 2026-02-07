import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/admin.css";

export default function Admin() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);

  const loadComplaints = async () => {
    const data = await apiRequest("/api/complaints", "GET", null, token);
    setComplaints(data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    await apiRequest(
      `/api/complaints/${id}/status`,
      "PATCH",
      { status },
      token
    );
    loadComplaints();
  };

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="admin-card">
          <h2 className="admin-title">Admin Dashboard</h2>

          {complaints.map((c) => (
            <div key={c._id} className="admin-item">
              <p className="admin-item-title"><b>{c.title}</b></p>
              <p className="admin-item-desc">{c.description}</p>
              <p className="admin-item-meta">
                Status: <b className={`status-pill ${c.status}`}>{c.status}</b>
              </p>
              <p className="admin-item-meta">
                User: {c.user?.name} ({c.user?.email})
              </p>

              <select
                className="admin-select"
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
