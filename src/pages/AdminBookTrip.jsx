import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { bookTrip } from "../api/trips.api";

const { Option } = Select;

/* FULL VEHICLE LIST */
const VEHICLES = [
  "DZIRE",
  "ETIOS",
  "TOYOTA GLANZA",
  "TOYOTA TAISOR",
  "ERTIGA",
  "TOYOTA RUMION",
  "TOYOTA HYRIDER",
  "INNOVA",
  "INNOVA CRYSTA",
  "INNOVA HYCROSS",
  "TOYOTA FORTUNER",
  "TOYOTA VELFIRE",
  "TOYOTA CAMRY HYBRID",
  "14 SEATER TEMPO TRAVELLER",
  "20 SEATER TEMPO TRAVELLER",
  "27 SEATER TEMPO TRAVELLER",
  "36 SEATER TEMPO TRAVELLER",
  "47 SEATER TEMPO TRAVELLER",
  "44 SEATER VOLVO",
];

export default function AdminBookTrip() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      /* get logged-in userId */
      const userId = localStorage.getItem("userId");

      if (!userId) {
        message.error("User session expired. Please login again.");
        navigate("/login");
        return;
      }

      await bookTrip({
        userId: userId, // ⭐ REQUIRED by backend
        userName: values.userName,
        userPhone: values.userPhone,
        pickupLocation: values.pickupLocation,
        dropLocation: values.dropLocation,
        vehicleType: values.vehicleType,
        travelDate: values.travelDate,
        numberOfDays: Number(values.numberOfDays),
        passengers: Number(values.passengers),
        tripNotes: values.tripNotes || "",
      });

      message.success("Trip booked successfully 🚕");

      form.resetFields();

      navigate("/"); // redirect to dashboard

    } catch (error) {
      console.error(error);
      message.error("Failed to book trip");
    }
  };

  return (
    <Card title="Admin Book Trip" style={{ maxWidth: 900, margin: "auto" }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Customer Name"
              name="userName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Customer Phone"
              name="userPhone"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Pickup Location"
              name="pickupLocation"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Drop Location"
              name="dropLocation"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Vehicle Type"
          name="vehicleType"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select vehicle">
            {VEHICLES.map((vehicle) => (
              <Option key={vehicle} value={vehicle}>
                {vehicle}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Travel Date"
              name="travelDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Number of Days"
              name="numberOfDays"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Passengers"
              name="passengers"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Trip Notes" name="tripNotes">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Create Trip
        </Button>

      </Form>
    </Card>
  );
}