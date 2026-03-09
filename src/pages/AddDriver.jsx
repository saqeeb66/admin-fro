import { Card, Form, Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const { Option } = Select;

export default function AddDriver() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const submit = async (values) => {
    try {
      await api.post("/admin/drivers/add", values);
      message.success("Driver created successfully");
      navigate("/drivers");
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to create driver"
      );
    }
  };

  return (
    <Card title="Add Driver" style={{ maxWidth: 500 }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={submit}
      >
        {/* DRIVER NAME */}
        <Form.Item
          name="name"
          label="Driver Name"
          rules={[
            { required: true, message: "Driver name is required" },
            { min: 3, message: "Name must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter driver name" />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        {/* PHONE */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Phone number is required" },
            {
              pattern: /^[6-9]\d{9}$/,
              message: "Enter a valid 10-digit mobile number",
            },
          ]}
        >
          <Input placeholder="10-digit mobile number" maxLength={10} />
        </Form.Item>

        {/* PASSWORD */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Minimum 6 characters" />
        </Form.Item>

        {/* CAR TYPE */}
        <Form.Item
          name="carType"
          label="Car Type"
          rules={[
            { required: true, message: "Please select car type" },
          ]}
        >
          <Select placeholder="Select car type">
            <Option value="SUV">SUV</Option>
            <Option value="Innova">Innova</Option>
            <Option value="Sedan">Sedan</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        {/* CAR NUMBER */}
        <Form.Item
          name="carNumber"
          label="Car Number"
          rules={[
            { required: true, message: "Car number is required" },
            {
              pattern: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
              message: "Enter valid car number (e.g. KA01AB1234)",
            },
          ]}
        >
          <Input placeholder="KA01AB1234" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Create Driver
        </Button>
      </Form>
    </Card>
  );
}
