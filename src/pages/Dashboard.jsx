import { Card, Row, Col, Tag, Button, Space } from "antd";
import {
  CalendarOutlined,
  CarOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  IdcardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await axios.get("/admin/trips");
      setTrips(res.data || []);
    } catch (err) {
      console.error("Failed to load trips", err);
    }
  };

  const countByStatus = (status) =>
    trips.filter((t) => t.status === status).length;

  const recentTrips = trips.slice(0, 4);

  return (
    <>
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Admin Dashboard</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/book-trip")}
        >
          Book New Trip
        </Button>
      </div>

      {/* TOP STATS */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="stat-card">
            <CalendarOutlined className="stat-icon blue" />
            <h2>{countByStatus("PENDING")}</h2>
            <p>Booked Trips</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <CarOutlined className="stat-icon orange" />
            <h2>{countByStatus("DRIVER_ASSIGNED")}</h2>
            <p>Allotted Trips</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <PlayCircleOutlined className="stat-icon green" />
            <h2>{countByStatus("TRIP_STARTED")}</h2>
            <p>Started Trips</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <CheckCircleOutlined className="stat-icon purple" />
            <h2>{countByStatus("TRIP_COMPLETED")}</h2>
            <p>Completed Trips</p>
          </Card>
        </Col>
      </Row>

      {/* RECENT TRIPS */}
      <div style={{ marginTop: 30 }}>
        <h2>Recent Trips</h2>

        <Row gutter={16}>
          {recentTrips.map((trip) => (
            <Col span={6} key={trip.tripId}>
              <Card
                className="trip-card"
                style={{
                  height: 320,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* HEADER */}
                <div className="trip-header">
                  <Space>
                    <Tag color={statusColor(trip.status)}>
                      {trip.status.replace("_", " ")}
                    </Tag>

                    <Tag icon={<IdcardOutlined />} color="default">
                      {trip.tripId.slice(-6)}
                    </Tag>
                  </Space>
                </div>

                {/* BODY */}
                <div>
                  <h3 style={{ marginBottom: 8 }}>{trip.userName}</h3>

                  <p>
                    <EnvironmentOutlined /> Pickup: {trip.pickupLocation}
                  </p>
                  <p>
                    <EnvironmentOutlined /> Drop: {trip.dropLocation}
                  </p>

                  <p>🚗 {trip.driverName || "Not Assigned"}</p>

                  <p>
                    <DollarOutlined /> ₹ {trip.totalAmount || "—"}
                  </p>
                </div>

                {/* ACTION */}
                <Button
                  type="primary"
                  block
                  onClick={() => navigate(`/trips/${trip.tripId}`)}
                >
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

/* STATUS COLOR HELPER */
function statusColor(status) {
  switch (status) {
    case "PENDING":
      return "blue";
    case "DRIVER_ASSIGNED":
      return "orange";
    case "TRIP_STARTED":
      return "green";
    case "TRIP_COMPLETED":
      return "purple";
    default:
      return "gray";
  }
}
