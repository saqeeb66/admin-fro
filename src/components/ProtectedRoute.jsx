import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  // Optional role check
  if (auth.user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
