import { Card, Row, Col, Tag, Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/drivers/available");

      setDrivers(
        res.data.map((d) => ({
          ...d,
          status: "AVAILABLE", // backend currently returns only available
        }))
      );
    } catch (err) {
      console.error("FAILED TO LOAD DRIVERS");
      console.error("Message:", err.message);
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <h2>Drivers</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/drivers/add")}
        >
          Add Driver
        </Button>
      </div>

      {/* EMPTY STATE */}
      {!loading && drivers.length === 0 && (
        <Empty description="No drivers available" />
      )}

      {/* DRIVER CARDS */}
      <Row gutter={16}>
        {drivers.map((driver) => (
          <Col span={6} key={driver.driverId}>
            <Card className="driver-card">
              <div className="driver-header">
                <span className="driver-name">{driver.name}</span>
                <Tag color="green">{driver.status}</Tag>
              </div>

              <p>📧 {driver.email}</p>
              <p>📞 {driver.phone}</p>
              <p>🚘 {driver.carType}</p>
              <p>🔢 {driver.carNumber}</p>

              <Button block disabled>
                View Profile
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
