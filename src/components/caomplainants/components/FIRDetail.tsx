// src/components/fir/FIRDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Space, Spin, List, Empty } from "antd";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";
import { Typography, Descriptions, Tag, Tooltip } from "antd";
import {
  CopyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Timeline } from "antd";

interface Complainant {
  name: string;
  phone: string;
  cnic: string;
  address: string;
  email: string;
}

interface Officer {
  name: string;
  badge_no: string;
  cnic: string;
  officer_rank: string;
  email: string;
}
interface FIRData {
  fir_id: string;
  description: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;

  Officer: Officer;
  Complainant: Complainant;
  PoliceStation: {
    name: string;
  };
  CrimeType: {
    name: string;
  };
}
interface Evidence {
  evidence_id: string;
  file_url: string;
  evidence_type: string;
  createdAt: string;
  updatedAt: string;
}

interface Suspect {
  suspect_id: string;
  name: string;
  cnic: string;
  description: string;
  isVerified: boolean;
  createdAt: string;
}

interface Arrest {
  arrest_id: string;
  description: string;
  createdAt: string;

  Officer: {
    name: string;
    badge_no: string;
  };

  Suspect: {
    name: string;
    cnic: string;
  };
}

interface History {
  history_id: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isVerified: string;
}

const FIRDetail: React.FC = () => {
  const { fir_id } = useParams<{ fir_id: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [fir, setFIR] = useState<FIRData | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [suspect, setSuspect] = useState<Suspect[]>([]);
  const [arrest, setArrest] = useState<Arrest[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const { Text } = Typography;

  const statusTag = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Pending
          </Tag>
        );
      case "investigation":
        return (
          <Tag icon={<SyncOutlined spin />} color="blue">
            Investigation
          </Tag>
        );
      case "solved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Solved
          </Tag>
        );
      case "closed":
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Closed
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const fetchFIRDetail = async () => {
    try {
      setLoading(true);
      const firData = await apiRequest<{ data: FIRData }>(
        "GET",
        `${apiUrl}/api/firs/${fir_id}`,
      );
      setFIR(firData.data);

      const evidenceData = await apiRequest<{ data: Evidence[] }>(
        "GET",
        `${apiUrl}/api/evidence/firs/${fir_id}`,
      );
      setEvidences(evidenceData.data || []);

      const suspectData = await apiRequest<{ data: Suspect[] }>(
        "GET",
        `${apiUrl}/api/suspects/firs/${fir_id}`,
      );
      setSuspect(suspectData.data || []);

      const arrestData = await apiRequest<{ data: Arrest[] }>(
        "GET",
        `${apiUrl}/api/arrests/firs/${fir_id}`,
      );
      setArrest(arrestData.data || []);

      const historyData = await apiRequest<{ data: History[] }>(
        "GET",
        `${apiUrl}/api/history/firs/${fir_id}`,
      );
      setHistory(historyData.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch FIR details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIRDetail();
  }, [fir_id]);

  if (loading) return <Spin />;

  if (!fir)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty
          description="No FIR data available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchFIRDetail}
          >
            Retry
          </Button>
        </Empty>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 w-full max-w-6xl mx-auto px-2 sm:px-4">
      <Card
        title={
          <Space wrap>
            <Text strong>FIR ID:</Text>
            <Text code>{fir.fir_id}</Text>
            <Tooltip title="Copy FIR ID">
              <CopyOutlined
                onClick={() => {
                  navigator.clipboard.writeText(fir.fir_id);
                  toast.success("FIR ID copied");
                }}
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          </Space>
        }
        extra={statusTag(fir.status)}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Description" span={2}>
            {fir.description}
          </Descriptions.Item>
          <Descriptions.Item label="Location">{fir.location}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(fir.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(fir.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Evidence">
        {evidences.length === 0 ? (
          "No Evidence available"
        ) : (
          <List
            dataSource={evidences}
            renderItem={(e) => (
              <List.Item>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Type">
                      {e.evidence_type}
                    </Descriptions.Item>
                    <Descriptions.Item label="File">
                      <a href={e.file_url} target="_blank">
                        View
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                      {new Date(e.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    {e.updatedAt !== e.createdAt && (
                      <Descriptions.Item label="Updated At">
                        {new Date(e.updatedAt).toLocaleString()}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card title="Complainant Details">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Name">
            {fir.Complainant?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {fir.Complainant?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="CNIC">
            {fir.Complainant?.cnic}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {fir.Complainant?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {fir.Complainant?.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Officer Details">
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Name">
            {fir.Officer?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Rank">
            {fir.Officer?.officer_rank}
          </Descriptions.Item>
          <Descriptions.Item label="Badge No">
            {fir.Officer?.badge_no}
          </Descriptions.Item>
          <Descriptions.Item label="CNIC">
            {fir.Officer?.cnic}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {fir.Officer?.email}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Suspects">
        <List
          dataSource={suspect}
          renderItem={(s) => (
            <List.Item>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Name">{s.name}</Descriptions.Item>
                  <Descriptions.Item label="CNIC">{s.cnic}</Descriptions.Item>
                  <Descriptions.Item label="Verified">
                    {s.isVerified ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="red">No</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>
                    {s.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At" span={2}>
                    {new Date(s.createdAt).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Arrest Details">
        <List
          dataSource={arrest}
          renderItem={(a) => (
            <List.Item>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Description" span={2}>
                    {a.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Arrested By">
                    {a.Officer?.name} ({a.Officer?.badge_no})
                  </Descriptions.Item>
                  <Descriptions.Item label="Suspect">
                    {a.Suspect?.name} - {a.Suspect?.cnic}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Case History" style={{ marginBottom: 16 }}>
        {history.length === 0 ? (
          "No history available"
        ) : (
          <Timeline>
            {history.map((h) => {
              const statusColor =
                h.status === "solved"
                  ? "green"
                  : h.status === "investigation"
                    ? "blue"
                    : h.status === "closed"
                      ? "red"
                      : "orange";

              const statusIcon =
                h.status === "solved" ? (
                  <CheckCircleOutlined />
                ) : h.status === "closed" ? (
                  <CloseCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                );

              return (
                <Timeline.Item
                  key={h.history_id}
                  color={statusColor}
                  dot={statusIcon}
                >
                  <div style={{ marginBottom: 6 }}>
                    <Tag color={statusColor}>{h.status.toUpperCase()}</Tag>
                    {h.isVerified && (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Verified
                      </Tag>
                    )}
                  </div>

                  <p style={{ marginBottom: 6 }}>
                    <b>Description:</b> {h.description}
                  </p>

                  {/* {h.Officer && (
                    <p style={{ marginBottom: 6 }}>
                      <UserOutlined /> <b>Action By:</b> {h.Officer.name} (
                      {h.Officer.officer_rank}) — Badge #{h.Officer.badge_no}
                    </p>
                  )} */}

                  <small style={{ color: "#888" }}>
                    Created: {new Date(h.createdAt).toLocaleString()}
                    {h.updatedAt !== h.createdAt && (
                      <> | Updated: {new Date(h.updatedAt).toLocaleString()}</>
                    )}
                  </small>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default FIRDetail;
