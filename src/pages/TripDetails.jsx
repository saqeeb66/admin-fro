import { Card, Descriptions, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import AwsRouteMap from "../components/AwsRouteMap";


export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    api.get(`/admin/trips/${tripId}`).then(res => setTrip(res.data));
  }, [tripId]);

  if (!trip) return null;

  return (
    <Card title="Trip Details" className="jetfleet-card">
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Trip ID">{trip.tripId}</Descriptions.Item>
        <Descriptions.Item label="Status">{trip.status}</Descriptions.Item>

        <Descriptions.Item label="User">{trip.userName}</Descriptions.Item>
        <Descriptions.Item label="Phone">{trip.userPhone}</Descriptions.Item>

        <Descriptions.Item label="Pickup">{trip.pickupLocation}</Descriptions.Item>
        <Descriptions.Item label="Drop">{trip.dropLocation}</Descriptions.Item>

        <Descriptions.Item label="Driver">
          {trip.driverName || "Not Assigned"}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle">
          {trip.driverCarType || "—"}
        </Descriptions.Item>
      </Descriptions>

      {trip.status === "TRIP_COMPLETED" && (
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => navigate(`/trips/${tripId}/report`)}
        >
          View Full Report
        </Button>
      )}
    </Card>
  );
}
