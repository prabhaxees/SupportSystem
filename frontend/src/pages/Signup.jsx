import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/auth/signup", "POST", {
        name,
        email,
        password
      });

      if (data.userId) {
        navigate("/");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
