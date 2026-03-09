import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav style={{ padding: 16, background: "#673ab7", color: "white" }}>
      <Link to="/dashboard" style={{ marginRight: 15, color: "white" }}>
        Dashboard
      </Link>
      <Link to="/trips" style={{ marginRight: 15, color: "white" }}>
        Trips
      </Link>
      <Link to="/assign-driver" style={{ marginRight: 15, color: "white" }}>
        Assign Driver
      </Link>
      <Link to="/drivers" style={{ marginRight: 15, color: "white" }}>
        Add Driver
      </Link>
      <button onClick={logout} style={{ marginLeft: 20 }}>
        Logout
      </button>
    </nav>
  );
}
