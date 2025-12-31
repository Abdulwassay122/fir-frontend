import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, theme } from "antd";
import { apiRequest } from "../../utils/apiRequest";
import { toast } from "react-toastify";
import { authStore } from "../../auth/auth";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const OfficerLogin: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInput = (values: any) => {
    if (!values.identifier?.trim()) {
      return "Email, CNIC, or Phone is required";
    }
    if (!values.password?.trim()) {
      return "Password is required";
    }
    if (values.password.length < 3) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    const validationError = validateInput(values);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    setError(null);

    try {
      const data = await apiRequest("POST", `${apiUrl}/api/officers/login`, {
        email: values.identifier,
        password: values.password,
      });

      toast.success(data.message);
      authStore.setRole("officer");
      navigate("/officer/dashboard");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colorBgContainer,
      }}
    >
      <Card title="Officer Login" style={{ width: 400 }}>
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email / CNIC / Phone"
            name="identifier"
            rules={[{ required: true, message: "Identifier is required" }]}
          >
            <Input placeholder="Enter email, CNIC or phone" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <a className="text-[13px] underline-offset-1 text-center" href="/">
            complainant login
          </a>
        </div>
      </Card>
    </div>
  );
};

export default OfficerLogin;
