import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";

interface CreateComplainantPayload {
  name: string;
  phone: string;
  cnic: string;
  email: string;
  password: string;
  address: string;
}

const CreateComplainant: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const onFinish = async (values: CreateComplainantPayload) => {
    try {
      setLoading(true);
      await apiRequest("POST", `${apiUrl}/api/complainants`, values);
      toast.success("Complainant created successfully");
      form.resetFields();
    } catch (err: any) {
      toast.error(err.message || "Failed to create complainant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Card title="Create Complainant"  style={{ width: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              {
                pattern: /^\+92\s?\d{3}\s?\d{6,7}$/,
                message: "Phone must be in Pakistani format (+92 XXX XXXXXX)",
              },
            ]}
          >
            <Input placeholder="+92 300 1234567" />
          </Form.Item>

          <Form.Item
            label="CNIC"
            name="cnic"
            rules={[
              { required: true, message: "CNIC is required" },
              {
                pattern: /^\d{5}-\d{7}-\d$/,
                message: "CNIC format: 42231-5495533-9",
              },
            ]}
          >
            <Input placeholder="42231-5495533-9" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 4, message: "Password must be at least 4 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Address is required" },
              { min: 5, message: "Address is too short" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Complainant
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateComplainant;
