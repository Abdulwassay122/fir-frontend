import React, { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";

interface StationFormValues {
  name: string;
  district: string;
  province: string;
  city: string;
}

const CreateStationForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: StationFormValues) => {
    try {
      setLoading(true);
      const res = await apiRequest(
        "POST",
        `${apiUrl}/api/stations/`,
        values
      );
      toast.success(res.message || "Station created successfully");
      form.resetFields();
    } catch (err: any) {
      toast.error(err.message || "Failed to create station");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card title="Create Police Station" style={{ width: 500 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Station Name"
            name="name"
            rules={[{ required: true, message: "Station name is required" }]}
          >
            <Input placeholder="Saeedabad Police Station" />
          </Form.Item>

          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "District is required" }]}
          >
            <Input placeholder="South" />
          </Form.Item>

          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Input placeholder="Sindh" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="Karachi" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Create Station
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateStationForm;
