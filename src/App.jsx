import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import AssignDriver from "./pages/AssignDriver";
import Drivers from "./pages/Drivers";
import Invoice from "./pages/Invoice";
import TripDetails from "./pages/TripDetails";
import TripFullReport from "./pages/TripFullReport";
import AppLayout from "./layout/AppLayout";
import AddDriver from "./pages/AddDriver";
import AdminBookTrip from "./pages/AdminBookTrip";


/* 🔐 PROTECTED ROUTE */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED APP */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="assign-driver" element={<AssignDriver />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="drivers/add" element={<AddDriver />} />
          <Route path="invoice/:tripId" element={<Invoice />} />
          <Route path="/admin/book-trip" element={<AdminBookTrip />} />
          <Route path="trips/:tripId" element={<TripDetails />} />
          <Route path="trips/:tripId/report" element={<TripFullReport />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
