// src/components/fir/FIRDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Select,
  Space,
  Spin,
  List,
  Empty,
  Popconfirm,
} from "antd";
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
  DeleteOutlined,
} from "@ant-design/icons";
import { Timeline } from "antd";
import { Modal, Form, Input } from "antd";

const { Option } = Select;

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
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [openEvidence, setOpenEvidence] = useState(false);
  const [openSuspect, setOpenSuspect] = useState(false);
  const [openArrest, setOpenArrest] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const [form] = Form.useForm();

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
          <Tag icon={<SyncOutlined />} color="blue">
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
        `${apiUrl}/api/firs/${fir_id}`
      );
      setFIR(firData.data);

      const evidenceData = await apiRequest<{ data: Evidence[] }>(
        "GET",
        `${apiUrl}/api/evidence/firs/${fir_id}`
      );
      setEvidences(evidenceData.data || []);

      const suspectData = await apiRequest<{ data: Suspect[] }>(
        "GET",
        `${apiUrl}/api/suspects/firs/${fir_id}`
      );
      setSuspect(suspectData.data || []);

      const arrestData = await apiRequest<{ data: Arrest[] }>(
        "GET",
        `${apiUrl}/api/arrests/firs/${fir_id}`
      );
      setArrest(arrestData.data || []);

      const historyData = await apiRequest<{ data: History[] }>(
        "GET",
        `${apiUrl}/api/history/firs/${fir_id}`
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

  const deleteFIR = async () => {
    try {
      await apiRequest("DELETE", `${apiUrl}/api/firs/${fir_id}`);
      toast.success("FIR deleted successfully");
      window.location.href = "/officer/dashboard/all-fir";
    } catch (err: any) {
      toast.error(err.message || "Failed to delete FIR");
    }
  };

  // const updateFIR = async () => {
  //   toast.info("Update FIR functionality not implemented yet");
  // };

  const toggleStatus = async (status: string) => {
    try {
      setStatusUpdating(true);
      await apiRequest("PATCH", `${apiUrl}/api/firs/${fir_id}/status`, {
        status,
      });
      toast.success("FIR status updated successfully");
      fetchFIRDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

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
    <div className="flex flex-col gap-2">
      <Card
        title={
          <Space>
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
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Description" span={2}>
            {fir.description}
          </Descriptions.Item>
          <Descriptions.Item label="Location">{fir.location}</Descriptions.Item>
          <Descriptions.Item label="Registered date">
            {new Date(fir.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated date">
            {new Date(fir.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Space style={{ marginTop: 16 }}>
          <Popconfirm
            title="Delete FIR"
            description="Are you sure you want to delete this FIR? This action cannot be undone."
            onConfirm={deleteFIR}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete FIR
            </Button>
          </Popconfirm>
          {/* <Button onClick={updateFIR}>Update FIR</Button> */}
          <Select
            value={fir.status}
            onChange={toggleStatus}
            loading={statusUpdating}
          >
            <Option value="pending">Pending</Option>
            <Option value="investigation">Investigation</Option>
            <Option value="solved">Solved</Option>
            <Option value="closed">Closed</Option>
          </Select>
        </Space>
      </Card>

      <Card title="Complainant Details">
        <Descriptions bordered>
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
        <Descriptions bordered>
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

      {/* Evidence Card */}
      <Card
        title="Evidence"
        extra={
          <Button onClick={() => setOpenEvidence(true)}>Add Evidence</Button>
        }
      >
        <List
          dataSource={evidences}
          renderItem={(e) => (
            <List.Item>
              <Descriptions size="small" bordered column={2}>
                <Descriptions.Item label="Type">
                  {e.evidence_type}
                </Descriptions.Item>
                <Descriptions.Item label="File">
                  <a href={e.file_url} target="_blank">
                    View
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                  {new Date(e.createdAt).toLocaleString()}
                </Descriptions.Item>
                {e.updatedAt !== e.createdAt && (
                  <Descriptions.Item label="Updated At">
                    {new Date(e.updatedAt).toLocaleString()}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </List.Item>
          )}
        />
      </Card>

      {/* Evidence Modal */}
      <Modal
        title="Add Evidence"
        open={openEvidence}
        onCancel={() => setOpenEvidence(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              await apiRequest(
                "POST",
                `${apiUrl}/api/evidence/firs/${fir_id}`,
                values
              );
              toast.success("Evidence added");
              setOpenEvidence(false);
              fetchFIRDetail();
              form.resetFields();
            } catch (err: any) {
              toast.error(err.message);
            }
          }}
          layout="vertical"
        >
          <Form.Item
            name="evidence_type"
            label="Evidence Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="file_url"
            label="File URL"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* suspect Card */}
      <Card
        title="Suspects"
        extra={
          <Button onClick={() => setOpenSuspect(true)}>Add Suspects</Button>
        }
      >
        <List
          dataSource={suspect}
          renderItem={(s) => (
            <List.Item>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Name">{s.name}</Descriptions.Item>
                <Descriptions.Item label="CNIC">{s.cnic}</Descriptions.Item>

                <Descriptions.Item label="Status">
                  {s.isVerified ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Verified
                    </Tag>
                  ) : (
                    <Tag color="orange">Unverified</Tag>
                  )}
                </Descriptions.Item>

                {!s.isVerified && (
                  <Descriptions.Item label="Action">
                    {!s.isVerified && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={async () => {
                          try {
                            await apiRequest(
                              "PATCH",
                              `${apiUrl}/api/suspects/${s.suspect_id}/verify`
                            );
                            toast.success("Suspect verified");
                            fetchFIRDetail();
                          } catch (err: any) {
                            toast.error(err.message);
                          }
                        }}
                      >
                        Verify
                      </Button>
                    )}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Description" span={2}>
                  {s.description}
                </Descriptions.Item>

                <Descriptions.Item label="Added On" span={2}>
                  {new Date(s.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Card>

      {/* suspect modal */}
      <Modal
        title="Add Suspect"
        open={openSuspect}
        onCancel={() => setOpenSuspect(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              await apiRequest(
                "POST",
                `${apiUrl}/api/suspects/firs/${fir_id}`,
                values
              );
              toast.success("Suspect added");
              setOpenSuspect(false);
              fetchFIRDetail();
              form.resetFields();
            } catch (err: any) {
              toast.error(err.message);
            }
          }}
          layout="vertical"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="cnic" label="CNIC" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* arrest card */}
      <Card
        title="Arrest Details"
        extra={<Button onClick={() => setOpenArrest(true)}>Add Arrest</Button>}
      >
        <List
          dataSource={arrest}
          renderItem={(a) => (
            <List.Item>
              <Descriptions bordered>
                <Descriptions.Item label="Name">
                  {a.Suspect?.name}
                </Descriptions.Item>
                <Descriptions.Item label="CNIC">
                  {a.Suspect?.cnic}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {a.description}
                </Descriptions.Item>
                <Descriptions.Item label="Arrested By">
                  {a.Officer?.name} ({a.Officer?.badge_no})
                </Descriptions.Item>
                <Descriptions.Item label="Arrest Date">
                  {new Date(a.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Card>

      {/* arrest modal */}
      <Modal
        title="Add Arrest"
        open={openArrest}
        onCancel={() => setOpenArrest(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              await apiRequest("POST", `${apiUrl}/api/arrests`, {
                ...values,
                fir_id,
              });
              toast.success("Arrest added");
              setOpenArrest(false);
              fetchFIRDetail();
              form.resetFields();
            } catch (err: any) {
              toast.error(err.message);
            }
          }}
          layout="vertical"
        >
          <Form.Item
            name="suspect_id"
            label="Suspect CNIC"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="officer_id"
            label="Officer CNIC"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* history card */}
      <Card
        title="Case History"
        style={{ marginBottom: 16 }}
        extra={
          <Button onClick={() => setOpenHistory(true)}>Add History</Button>
        }
      >
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

      {/* arrest modal */}
      <Modal
        title="Add Case History"
        open={openHistory}
        onCancel={() => setOpenHistory(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              await apiRequest(
                "POST",
                `${apiUrl}/api/history/firs/${fir_id}`,
                values
              );
              toast.success("History added");
              setOpenHistory(false);
              fetchFIRDetail();
              form.resetFields();
            } catch (err: any) {
              toast.error(err.message);
            }
          }}
          layout="vertical"
        >
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="investigation">Investigation</Option>
              <Option value="solved">Solved</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FIRDetail;
