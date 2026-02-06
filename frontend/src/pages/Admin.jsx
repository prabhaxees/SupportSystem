import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        {complaints.map((c) => (
          <div
            key={c._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <p><b>{c.title}</b></p>
            <p>{c.description}</p>
            <p>Status: <b>{c.status}</b></p>
            <p>User: {c.user?.name} ({c.user?.email})</p>

            <select
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
    </>
  );
}
