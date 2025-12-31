// src/components/fir/FIRList.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Select, Button, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { apiRequest } from "../../../utils/apiRequest";

const { Option } = Select;

interface FIR {
  fir_id: string;
  description: string;
  status: string;
  location: string;
  Officer: { officer_id: string; name: string };
  PoliceStation: { station_id: string; name: string };
  CrimeType: { type_id: string; name: string };
}

interface Officer {
  officer_id: string;
  name: string;
}

interface Station {
  station_id: string;
  name: string;
}

interface CrimeType {
  type_id: string;
  name: string;
}

const FIRList: React.FC = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [firs, setFirs] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(false);

  const [officers, setOfficers] = useState<Officer[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [types, setTypes] = useState<CrimeType[]>([]);

  const [filters, setFilters] = useState({
    officer_id: "",
    station_id: "",
    type_id: "",
    status: "",
    search: "",
  });

  // Fetch FIRs
  const fetchFIRs = async () => {
    setLoading(true);
    try {
      const payload = {
        filters: {
          officer_id: filters.officer_id || "",
          station_id: filters.station_id || "",
          type_id: filters.type_id || "",
          status: filters.status || "",
        },
        search: filters.search || "",
        sortField: "date_filed",
        sortOrder: "desc",
      };
      console.log(payload)
      const data = await apiRequest<{ data: FIR[] }>(
        "POST",
        `${apiUrl}/api/firs/search`,
        payload
      );
      setFirs(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch options for filters
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const stationsData = await apiRequest<{ data: Station[] }>(
          "GET",
          `${apiUrl}/api/stations/`
        );
        setStations(stationsData.data);

        const typesData = await apiRequest<{ data: CrimeType[] }>(
          "GET",
          `${apiUrl}/api/crime/crime-types`
        );
        setTypes(typesData.data);

        const officersData = await apiRequest<{ data: Officer[] }>(
          "GET",
          `${apiUrl}/api/officers/search?q=`
        );
        setOfficers(officersData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, [apiUrl]);

  useEffect(() => {
    fetchFIRs();
  }, [filters]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };
  const debouncedSearch = useCallback(debounce(handleSearchChange, 500), []);

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
      render: (text: any, record: FIR) => record.Officer?.name || "-",
    },
    {
      title: "Station",
      render: (text: any, record: FIR) => record.PoliceStation?.name || "-",
    },
    {
      title: "Type",
      render: (text: any, record: FIR) => record.CrimeType?.name || "-",
    },
    {
      title: "Action",
      render: (text: any, record: FIR) => (
        <Space>
          <Button onClick={() => navigate(`/officer/dashboard/fir-detail/${record.fir_id}`)}>View</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search FIRs"
          onChange={(e) => debouncedSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by Officer"
          style={{ width: 200 }}
          onChange={(val) => setFilters((f) => ({ ...f, officer_id: val }))}
          allowClear
        >
          {officers.map((o) => (
            <Option key={o.officer_id} value={o.officer_id}>
              {o.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Station"
          style={{ width: 200 }}
          onChange={(val) => setFilters((f) => ({ ...f, station_id: val }))}
          allowClear
        >
          {stations.map((s) => (
            <Option key={s.station_id} value={s.station_id}>
              {s.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Type"
          style={{ width: 200 }}
          onChange={(val) => setFilters((f) => ({ ...f, type_id: val }))}
          allowClear
        >
          {types.map((t) => (
            <Option key={t.type_id} value={t.type_id}>
              {t.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          onChange={(val) => setFilters((f) => ({ ...f, status: val }))}
          allowClear
        >
          <Option value="pending">Pending</Option>
          <Option value="investigation">Investigation</Option>
          <Option value="solved">Solved</Option>
          <Option value="closed">Closed</Option>
        </Select>
      </Space>

      <Table
        rowKey="fir_id"
        columns={columns}
        dataSource={firs}
        loading={loading}
      />
    </div>
  );
};

export default FIRList;
