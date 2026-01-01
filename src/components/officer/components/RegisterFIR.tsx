// src/components/RegisterFIR.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Form, Input, Select, Button, Spin } from "antd";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/apiRequest";
import Spinner from "../../../assets/Iphone-spinner-2.gif";
import Title from "antd/es/typography/Title";

const { Option } = Select;

interface Station {
  station_id: string;
  name: string;
  district: string;
  city: string;
  province: string;
}

interface CrimeType {
  type_id: string;
  name: string;
}

interface Officer {
  officer_id: string;
  name: string;
}

const RegisterFIR: React.FC = () => {
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [stations, setStations] = useState<Station[]>([]);
  const [types, setTypes] = useState<CrimeType[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [officerLoading, setOfficerLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch stations
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<{ data: Station[] }>(
          "GET",
          `${apiUrl}/api/stations/`
        );
        setStations(data.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch stations");
      }
    })();
  }, [apiUrl]);

  // Fetch crime types
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<{ data: CrimeType[] }>(
          "GET",
          `${apiUrl}/api/crime/crime-types`
        );
        setTypes(data.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch crime types");
      }
    })();
  }, [apiUrl]);

  // Officer search function with debounce
  const fetchOfficers = async (q: string) => {
    if (!q) {
      setOfficers([]);
      return;
    }
    setOfficerLoading(true);
    try {
      const data = await apiRequest<{ data: Officer[] }>(
        "GET",
        `${apiUrl}/api/officers/search?q=${q}`
      );
      setOfficers(data.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch officers");
    } finally {
      setOfficerLoading(false);
    }
  };

  // Debounced version
  const debounceFetchOfficers = useCallback(debounce(fetchOfficers, 500), []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = {
        complainant_id: values.complainantCnic,
        officer_id: values.officer,
        station_id: values.station,
        type_id: values.type,
        description: values.description,
        location: values.location || "",
      };
      const data = await apiRequest("POST", `${apiUrl}/api/firs`, payload);
      toast.success(data.message);
      form.resetFields();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit FIR");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <Title level={3} className="text-center">
        Register FIR
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Form.Item
          label="Complainant CNIC"
          name="complainantCnic"
          rules={[{ required: true, message: "Please enter CNIC" }]}
        >
          <Input placeholder="Enter CNIC" />
        </Form.Item>

        <Form.Item
          label="Officer"
          name="officer"
          rules={[{ required: true, message: "Please select an officer" }]}
        >
          <Select
            showSearch
            placeholder="Search officer"
            onSearch={debounceFetchOfficers}
            notFoundContent={officerLoading ? <Spin /> : null}
            filterOption={false}
          >
            {officers.map((o) => (
              <Option key={o.officer_id} value={o.officer_id}>
                {o.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Station"
          name="station"
          rules={[{ required: true, message: "Please select a station" }]}
        >
          <Select placeholder="Select station">
            {stations.map((s) => (
              <Option key={s.station_id} value={s.station_id}>
                {s.name} - {s.city}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select a crime type" }]}
        >
          <Select placeholder="Select type">
            {types.map((t) => (
              <Option key={t.type_id} value={t.type_id}>
                {t.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item label="Location" name="location">
          <Input placeholder="Enter location (optional)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? (
              <img src={Spinner} alt="Loading" style={{ height: 20 }} />
            ) : (
              "Submit FIR"
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterFIR;
