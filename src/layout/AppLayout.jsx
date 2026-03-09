import { Layout, Input } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./layout.css";

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();

  /* 🔴 LOGOUT */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("LOGOUT_EVENT", Date.now());
    navigate("/login", { replace: true });
  };

  /* 🔥 LISTEN FOR LOGOUT FROM OTHER TABS */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "LOGOUT_EVENT") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* 🔍 SEARCH HANDLER */
  const onSearch = (value) => {
    const query = value.trim();
    if (!query) return;

    navigate(`/trips?search=${encodeURIComponent(query)}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider width={260} className="sidebar">
        <div className="logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">Jetfleet</span>
        </div>

        <div className="menu-section">
          <p className="menu-title">MAIN MENU</p>

          <NavLink to="/dashboard" className="menu-item">
            <DashboardOutlined /> Dashboard
          </NavLink>

          {/* 🔥 NEW BOOK TRIP LINK */}
          <NavLink to="/admin/book-trip" className="menu-item">
            <PlusOutlined /> Book Trip
          </NavLink>

          <NavLink to="/trips" className="menu-item">
            <CarOutlined /> All Trips
          </NavLink>

          <NavLink to="/drivers" className="menu-item">
            <TeamOutlined /> Drivers
          </NavLink>
        </div>

        <div className="menu-section">
          <p className="menu-title">TRIP STATUS</p>

          <NavLink to="/trips?status=PENDING" className="menu-item">
            <ClockCircleOutlined /> Booked Trips
          </NavLink>

          <NavLink to="/trips?status=DRIVER_ASSIGNED" className="menu-item">
            <CheckCircleOutlined /> Allotted Trips
          </NavLink>

          <NavLink to="/trips?status=TRIP_STARTED" className="menu-item">
            <PlayCircleOutlined /> Started Trips
          </NavLink>

          <NavLink to="/trips?status=TRIP_COMPLETED" className="menu-item">
            <CheckCircleOutlined /> Completed Trips
          </NavLink>
        </div>

        <div className="logout" onClick={logout}>
          <LogoutOutlined /> Logout
        </div>
      </Sider>

      {/* MAIN */}
      <Layout>
        <Header className="top-header">
          <Input.Search
            placeholder="Search by Trip ID, User, Phone, Driver..."
            className="search-box"
            allowClear
            onSearch={onSearch}
          />
        </Header>

        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
