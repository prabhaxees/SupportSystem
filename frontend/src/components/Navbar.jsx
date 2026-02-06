import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";


export default function Navbar() {
  const { logout, role } = useAuth();

  return (
    <nav className="navbar">
      <h3>Support System</h3>

      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chat">Chatbot</Link>

        {role === "admin" && <Link to="/admin">Admin</Link>}

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#222",
    color: "#fff"
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  }
};
