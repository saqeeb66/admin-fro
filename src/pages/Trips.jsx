import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusFilter = searchParams.get("status");

  useEffect(() => {
    fetchTrips();
  }, [statusFilter]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/trips");
      let data = res.data || [];

      if (statusFilter) {
        data = data.filter((t) => t.status === statusFilter);
      }

      setTrips(data);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Trip ID",
      dataIndex: "tripId",
      key: "tripId",
      width: 220,
      ellipsis: true,
    },
    {
      title: "User",
      dataIndex: "userName",
    },
    {
      title: "Pickup",
      dataIndex: "pickupLocation",
    },
    {
      title: "Drop",
      dataIndex: "dropLocation",
    },
    {
      title: "Driver",
      render: (_, record) => record.driverName || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusColor(status)}>
          {status.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
        <Button
  type="link"
  onClick={() => navigate(`/trips/${record.tripId}`)}
>
  View
</Button>



          {record.status === "PENDING" && (
            <Button
              size="small"
              type="primary"
              onClick={() =>
                navigate(`/assign-driver?tripId=${record.tripId}`)
              }
            >
              Assign Driver
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>All Trips</h2>
      <Table
        columns={columns}
        dataSource={trips}
        loading={loading}
        rowKey="tripId"
        pagination={{ pageSize: 6 }}
        bordered
      />
    </div>
  );
}

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
      return "default";
  }
}
