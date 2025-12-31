import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spin, Alert, Select, Typography, theme } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiRequest } from "../../../utils/apiRequest";

const { Title } = Typography;
const { Option } = Select;
const apiUrl = import.meta.env.VITE_API_URL;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B9D",
];

interface DashboardData {
  firsByStatus: any[];
  crimeRate: any[];
  officerWorkload: any[];
  solvedFirs: any[];
  stationFirs: any[];
  crimeTypes: any[];
  crimeCategories: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [crimeRateFilter, setCrimeRateFilter] = useState("day");
  const [data, setData] = useState<DashboardData>({
    firsByStatus: [],
    crimeRate: [],
    officerWorkload: [],
    solvedFirs: [],
    stationFirs: [],
    crimeTypes: [],
    crimeCategories: [],
  });

  const fetchAllData = async (filter: string = "day") => {
    try {
      setLoading(true);
      setError(null);

      const [
        firsByStatusRes,
        crimeRateRes,
        officerWorkloadRes,
        solvedFirsRes,
        stationFirsRes,
        crimeTypesRes,
        crimeCategoriesRes,
      ] = await Promise.all([
        apiRequest("GET", `${apiUrl}/api/analytics/firs-by-status`),
        apiRequest(
          "GET",
          `${apiUrl}/api/analytics/crime-rate?filter=${filter}`
        ),
        apiRequest("GET", `${apiUrl}/api/analytics/officer-workload`),
        apiRequest("GET", `${apiUrl}/api/analytics/officer-solved-firs`),
        apiRequest("GET", `${apiUrl}/api/analytics/station-firs`),
        apiRequest("GET", `${apiUrl}/api/analytics/firs-by-crime-type`),
        apiRequest("GET", `${apiUrl}/api/analytics/firs-by-crime-category`),
      ]);

      console.log(
        firsByStatusRes,
        crimeRateRes,
        officerWorkloadRes,
        solvedFirsRes,
        stationFirsRes,
        crimeTypesRes,
        crimeCategoriesRes
      );

      if (!firsByStatusRes.success)
        throw new Error("Failed to fetch FIR status data");

      setData({
        firsByStatus: firsByStatusRes.data || [],
        crimeRate: crimeRateRes.data || [],
        officerWorkload: officerWorkloadRes.data || [],
        solvedFirs: solvedFirsRes.data || [],
        stationFirs: stationFirsRes.data || [],
        crimeTypes: crimeTypesRes.data || [],
        crimeCategories: crimeCategoriesRes.data || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(crimeRateFilter);
  }, []);

  const handleFilterChange = (value: string) => {
    setCrimeRateFilter(value);
    fetchAllData(value);
  };

  // Transform FIR status data for stacked area chart
  const transformedStatusData = data.firsByStatus.map((item) => ({
    date: item.date,
    Pending: parseInt(item.pending) || 0,
    Investigation: parseInt(item.investigation) || 0,
    Solved: parseInt(item.solved) || 0,
    Closed: parseInt(item.closed) || 0,
  }));

  // Transform crime rate data
  const transformedCrimeRate = data.crimeRate.map((item) => ({
    period: item.period,
    total: item.total_firs,
  }));

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert title="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        background: colorBgContainer,
        minHeight: "100vh",
      }}
    >
      <Title level={2} style={{ marginBottom: "24px" }}>
        Analytics Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        {/* FIR Status Over Time */}
        <Col xs={24} xl={12}>
          <Card title="FIR Status Timeline" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transformedStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Pending"
                  stroke="#FF8042"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Investigation"
                  stroke="#FFBB28"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Solved"
                  stroke="#00C49F"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Closed"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Crime Rate */}
        <Col xs={24} xl={12}>
          <Card
            title="Crime Rate Trends"
            bordered={false}
            extra={
              <Select
                value={crimeRateFilter}
                onChange={handleFilterChange}
                style={{ width: 120 }}
              >
                <Option value="day">Daily</Option>
                <Option value="week">Weekly</Option>
                <Option value="month">Monthly</Option>
                <Option value="year">Yearly</Option>
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedCrimeRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884D8" name="Total FIRs" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Officer Workload */}
        <Col xs={24} xl={12}>
          <Card title="Officer Workload" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.officerWorkload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="officer_name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="assigned_firs"
                  fill="#0088FE"
                  name="Assigned FIRs"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Solved FIRs by Officer */}
        <Col xs={24} xl={12}>
          <Card title="Solved FIRs by Officer" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.solvedFirs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="officer_name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="solved_firs" fill="#00C49F" name="Solved FIRs" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* FIRs by Station */}
        <Col xs={24} xl={12}>
          <Card title="FIRs by Police Station" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.stationFirs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="station_name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_firs" fill="#FFBB28" name="Total FIRs" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* FIRs by Crime Type */}
        <Col xs={24} xl={12}>
          <Card title="FIRs by Crime Type" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.crimeTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type_name, percent }: any) =>
                    `${type_name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_firs"
                  nameKey="type_name"
                >
                  {data.crimeTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* FIRs by Crime Category */}
        <Col xs={24} xl={12}>
          <Card title="FIRs by Crime Category" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.crimeCategories.map((item) => ({
                    ...item,
                    total_firs: Number(item.total_firs), // convert string to number
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category_name, percent }: any) =>
                    `${category_name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_firs"
                  nameKey="category_name"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
