import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Spin,
  message,
  Divider,
  theme,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { apiRequest } from "../../../utils/apiRequest";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const apiUrl = import.meta.env.VITE_API_URL;

interface Complainant {
  complainant_id: string;
  name: string;
  badge_no: string;
  email: string;
  cnic: string;
  officer_rank: string;
  createdAt: string;
  PoliceStation: {
    name: string;
    station_id: string;
    city: string;
  };
}

const ComplainantProfile: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [user, setUser] = useState<Complainant | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("GET", `${apiUrl}/api/officers/user`);
      setUser(res.data);
    } catch (err: any) {
      message.error(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await apiRequest("GET", `${apiUrl}/api/officers/logout`);
      message.success(res.message);
      navigate("/");
    } catch (err: any) {
      message.error(err?.message || "Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: colorBgContainer }}>
      <Row justify="center">
        <Col xs={24} md={18} lg={12}>
          <Card
            style={{ borderRadius: 12, overflow: "hidden" }}
            bodyStyle={{ padding: 24 }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1677ff, #4096ff)",
                padding: 24,
                borderRadius: 10,
                color: "#fff",
                marginBottom: 24,
              }}
            >
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar size={72} icon={<UserOutlined />} />
                </Col>
                <Col>
                  <Title level={4} style={{ color: "#fff", margin: 0 }}>
                    {user?.name}
                  </Title>
                  <Text style={{ color: "#e6f4ff" }}>Officer Profile</Text>
                </Col>
              </Row>
            </div>

            {/* Info */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">
                  <MailOutlined /> Email
                </Text>
                <br />
                <Text strong>{user?.email}</Text>
              </Col>

              <Col span={12}>
                <Text type="secondary">Bagge No</Text>
                <br />
                <Text strong>{user?.badge_no}</Text>
              </Col>

              <Col span={12}>
                <Text type="secondary">
                  <IdcardOutlined /> CNIC
                </Text>
                <br />
                <Text strong>{user?.cnic}</Text>
              </Col>

              <Col span={12}>
                <Text type="secondary">Officer Rank</Text>
                <br />
                <Text strong>{user?.officer_rank}</Text>
              </Col>

              <Col span={12}>
                <Text type="secondary">Police Station</Text>
                <br />
                <Text strong>{user?.PoliceStation.name} - {user?.PoliceStation.city}</Text>
              </Col>
            </Row>

            <Divider />

            {/* Footer */}
            <Row justify="space-between" align="middle">
              <Text type="secondary">
                Joined on {new Date(user?.createdAt || "").toLocaleDateString()}
              </Text>

              <Button
                danger
                icon={<LogoutOutlined />}
                loading={logoutLoading}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ComplainantProfile;
