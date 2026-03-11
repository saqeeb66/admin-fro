import { Card, Row, Col, Button, Tag, message } from "antd";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function AssignDriver() {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tripRes = await api.get("/admin/trips");
      setTrips(tripRes.data.filter(t => t.status === "PENDING"));

      const driverRes = await api.get("/admin/drivers/available");
      setDrivers(driverRes.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load data");
    }
  };

  const assignDriver = async () => {
    if (!selectedTrip || !selectedDriver) {
      message.warning("Select both Trip and Driver");
      return;
    }
  
    try {
      setLoading(true);
  
      await api.post(
              `/admin/trips/${selectedTrip.tripId}/assign/${selectedDriver.driverId}`
      );
  
      message.success("Driver assigned successfully");
  
      setSelectedTrip(null);
      setSelectedDriver(null);
      loadData();
    } catch (err) {
      console.error(err);
      message.error("Assignment failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Assign Driver</h2>

      <Row gutter={16}>
        {/* PENDING TRIPS */}
        <Col span={12}>
          <h3>Pending Trips</h3>

          {trips.map(trip => (
            <Card
              key={trip.tripId}
              className={
                selectedTrip?.tripId === trip.tripId
                  ? "select-card active"
                  : "select-card"
              }
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="card-header">
                <span>{trip.userName}</span>
                <Tag color="blue">BOOKED</Tag>
              </div>

              <p>📍 {trip.pickupLocation}</p>
              <p>📍 {trip.dropLocation}</p>
              <p>🚗 {trip.vehicleType}</p>
            </Card>
          ))}
        </Col>

        {/* AVAILABLE DRIVERS */}
        <Col span={12}>
          <h3>Available Drivers</h3>

          {drivers.map(driver => (
            <Card
              key={driver.driverId}
              className={
                selectedDriver?.driverId === driver.driverId
                  ? "select-card active"
                  : "select-card"
              }
              onClick={() => setSelectedDriver(driver)}
            >
              <div className="card-header">
                <span>{driver.name}</span>
                <Tag color="green">AVAILABLE</Tag>
              </div>

              <p>📞 {driver.phone}</p>
              <p>🚘 {driver.carType}</p>
              <p>🔢 {driver.carNumber}</p>
            </Card>
          ))}
        </Col>
      </Row>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={assignDriver}
        >
          Assign Driver
        </Button>
      </div>
    </div>
  );
}
