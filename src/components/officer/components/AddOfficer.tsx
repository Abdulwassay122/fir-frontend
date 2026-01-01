import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card } from "antd";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";

const { Option } = Select;

interface Station {
  station_id: string;
  name: string;
  city: string;
}

interface OfficerFormValues {
  station_id: string;
  name: string;
  badge_no: string;
  cnic: string;
  officer_rank: string;
  email: string;
  password: string;
}

const CreateOfficerForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(false);

  /** Fetch stations */
  const fetchStations = async () => {
    try {
      setStationsLoading(true);
      const res = await apiRequest<{ data: Station[] }>(
        "GET",
        `${apiUrl}/api/stations/`
      );
      setStations(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch stations");
    } finally {
      setStationsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  /** Submit form */
  const onFinish = async (values: OfficerFormValues) => {
    try {
      setLoading(true);
      await apiRequest("POST", `${apiUrl}/api/officers`, values);
      toast.success("Officer created successfully");
      form.resetFields();
    } catch (err: any) {
      toast.error(err.message || "Failed to create officer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create Officer" style={{ maxWidth: 500, margin: "0 auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Police Station"
          name="station_id"
          rules={[{ required: true, message: "Please select a station" }]}
        >
          <Select
            placeholder="Select station"
            loading={stationsLoading}
            showSearch
            optionFilterProp="children"
          >
            {stations.map((station) => (
              <Option key={station.station_id} value={station.station_id}>
                {station.name} — {station.city}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Officer Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Irfan Bahadur" />
        </Form.Item>

        <Form.Item
          label="Badge Number"
          name="badge_no"
          rules={[{ required: true, message: "Badge number is required" }]}
        >
          <Input placeholder="1985" />
        </Form.Item>

        <Form.Item
          label="CNIC"
          name="cnic"
          rules={[
            { required: true, message: "CNIC is required" },
            { pattern: /^\d{5}-\d{7}-\d$/, message: "Invalid CNIC format" },
          ]}
        >
          <Input placeholder="11111-1111111-1" />
        </Form.Item>

        <Form.Item
          label="Officer Rank"
          name="officer_rank"
          rules={[{ required: true, message: "Rank is required" }]}
        >
          <Input placeholder="SSP" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="irfanbh@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 4, message: "Minimum 4 characters" },
          ]}
        >
          <Input.Password placeholder="••••" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Officer
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateOfficerForm;
