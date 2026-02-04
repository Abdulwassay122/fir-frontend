// src/components/fir/FIRList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/apiRequest";

interface FIR {
  fir_id: string;
  description: string;
  status: string;
  location: string;
  Officer: { officer_id: string; name: string };
  PoliceStation: { station_id: string; name: string };
  CrimeType: { type_id: string; name: string };
}

const FIRList: React.FC = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [firs, setFirs] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch FIRs
  const fetchFIRs = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ data: FIR[] }>(
        "get",
        `${apiUrl}/api/firs/user-firs`,
      );
      setFirs(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIRs();
  }, []);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Officer",
      render: (_: any, record: FIR) => record.Officer?.name || "-",
    },
    {
      title: "Station",
      render: (_: any, record: FIR) => record.PoliceStation?.name || "-",
    },
    {
      title: "Type",
      render: (_: any, record: FIR) => record.CrimeType?.name || "-",
    },
    {
      title: "Action",
      render: (_: any, record: FIR) => (
        <Space>
          <Button
            onClick={() =>
              navigate(`/complainant/dashboard/fir-detail/${record.fir_id}`)
            }
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography className="ml-2 mb-2">Your FIRs</Typography>
      <Table
        rowKey="fir_id"
        columns={columns}
        dataSource={firs}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default FIRList;
