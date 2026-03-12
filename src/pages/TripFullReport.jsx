import {
  Card,
  Descriptions,
  Table,
  Button,
  Tag,
  Row,
  Col,
  Input,
  TimePicker,
} from "antd";
import { Image as AntImage } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { generateDutySlip } from "../utils/generateDutySlip";

export default function TripFullReport() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [dutySlip] = useState({
    date: "",
    regNo: "",
    raNo: "",
    dutyType: "",
    corporateName: "",
    serviceCity: "",
    paymentMode: "",
    bookingNo: "",
    pickupAddress: "",
    dropAddress: "",
    parking: "",
    toll: "",
    others: "",
    remarks: "",
  });

  /* ================= GARAGE DATA ================= */

  const [garageData, setGarageData] = useState([
    {
      key: "pickup",
      type: "Garage Pickup",
      km: "",
      time: "",
    },
    {
      key: "drop",
      type: "Garage Drop",
      km: "",
      time: "",
    },
  ]);

  const handleGarageChange = (value, key, field) => {
    const updated = garageData.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setGarageData(updated);
  };

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api
      .get(`/admin/trips/${tripId}`)
      .then(res => setTrip(res.data))
      .catch(() => setTrip(null));

    api
      .get(`/admin/expenses/${tripId}`)
      .then(res => setExpenses(res.data))
      .catch(() => setExpenses([]));
  }, [tripId]);

  if (!trip) return null;

  /* ================= DRIVER EXPENSES ================= */

  const driverExpenses = expenses;

  /* ================= TOTAL DISTANCE ================= */

  const totalKm =
    trip.startKm && trip.endKm
      ? (trip.endKm - trip.startKm).toFixed(2)
      : 0;

  /* ================= MAP ================= */

  const origin =
    trip.pickupLocation || trip.startLocation || "";

  const destination =
    trip.dropLocation || trip.endLocation || "";

  const mapUrl =
    origin && destination
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          origin
        )}+to+${encodeURIComponent(destination)}&output=embed`
      : null;

  return (
    <Card title="Trip Full Report">
      <Tag color="purple">
        {trip.status?.replace("_", " ")}
      </Tag>

      {/* ================= TRIP SUMMARY ================= */}

      <Descriptions bordered column={2} style={{ marginTop: 20 }}>
        <Descriptions.Item label="Trip ID">
          {trip.tripId}
        </Descriptions.Item>

        <Descriptions.Item label="Vehicle">
          {trip.vehicleType}
        </Descriptions.Item>

        <Descriptions.Item label="Start Location">
          {trip.startLocation || trip.pickupLocation}
        </Descriptions.Item>

        <Descriptions.Item label="Start KM">
          {trip.startKm}
        </Descriptions.Item>

        <Descriptions.Item label="End Location">
          {trip.endLocation || trip.dropLocation}
        </Descriptions.Item>

        <Descriptions.Item label="End KM">
          {trip.endKm}
        </Descriptions.Item>

        <Descriptions.Item label="Total Distance">
          {totalKm} KM
        </Descriptions.Item>

        <Descriptions.Item label="Total Amount">
          ₹ {trip.totalAmount || 0}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= ROUTE MAP ================= */}

      {mapUrl && (
        <Card title="Route Map (Pickup → Drop)" style={{ marginTop: 20 }}>
          <iframe
            title="Trip Route Map"
            src={mapUrl}
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: 8 }}
            loading="lazy"
          />
        </Card>
      )}

      {/* ================= USER DETAILS ================= */}

      <Descriptions
        title="User Details"
        bordered
        column={2}
        style={{ marginTop: 20 }}
      >
        <Descriptions.Item label="Name">
          {trip.userName}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {trip.userPhone}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= DRIVER DETAILS ================= */}

      <Descriptions
        title="Driver Details"
        bordered
        column={2}
        style={{ marginTop: 20 }}
      >
        <Descriptions.Item label="Name">
          {trip.driverName}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {trip.driverPhone}
        </Descriptions.Item>

        <Descriptions.Item label="Vehicle">
          {trip.driverCarType}
        </Descriptions.Item>

        <Descriptions.Item label="Vehicle No">
          {trip.driverCarNumber}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= GARAGE MOVEMENT ================= */}

      <Table
        title={() => "Garage Movement"}
        dataSource={garageData}
        rowKey="key"
        pagination={false}
        style={{ marginTop: 20 }}
        columns={[
          {
            title: "Type",
            dataIndex: "type",
          },
          {
            title: "KM",
            render: (_, record) => (
              <Input
                placeholder="Enter KM"
                value={record.km}
                onChange={e =>
                  handleGarageChange(
                    e.target.value,
                    record.key,
                    "km"
                  )
                }
              />
            ),
          },
          {
            title: "Time",
            render: (_, record) => (
              <TimePicker
                style={{ width: "100%" }}
                onChange={(time, timeString) =>
                  handleGarageChange(
                    timeString,
                    record.key,
                    "time"
                  )
                }
              />
            ),
          },
        ]}
      />

      {/* ================= ODOMETER SECTION ================= */}

      <Card title="Odometer Proof" style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={12}>
            <h4>Start Odometer</h4>
            {trip.odometerImageUrl ? (
              <Image width={250} src={trip.odometerImageUrl} />
            ) : (
              "No start odometer image"
            )}
          </Col>

          <Col span={12}>
            <h4>End Odometer</h4>
            {trip.endOdometerImageUrl ? (
              <Image width={250} src={trip.endOdometerImageUrl} />
            ) : (
              "No end odometer image"
            )}
          </Col>
        </Row>
      </Card>

      {/* ================= SIGNATURE ================= */}

      <Card title="Customer Signature" style={{ marginTop: 20 }}>
        {trip.signatureUrl ? (
          <Image width={220} src={trip.signatureUrl} />
        ) : (
          "No signature available"
        )}
      </Card>

      {/* ================= DRIVER EXPENSES ================= */}

      <Table
        title={() => "Driver Added Expenses"}
        dataSource={driverExpenses}
        rowKey="expenseId"
        pagination={false}
        style={{ marginTop: 20 }}
        columns={[
          {
            title: "Type",
            dataIndex: "type",
          },
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Amount",
            dataIndex: "amount",
            render: val => `₹ ${val}`,
          },
        ]}
      />

      {/* ================= PDF ================= */}

<Button
  type="primary"
  style={{ marginTop: 20 }}
  onClick={async () => {
    try {
      await generateDutySlip(dutySlip, trip, garageData);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  }}
>
  Download Official Duty Slip (PDF)
</Button>
    </Card>
  );
}
