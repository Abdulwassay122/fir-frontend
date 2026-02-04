import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Space, Select, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";

const { Search } = Input;

interface Officer {
  officer_id: string;
  name: string;
  badge_no: string;
  cnic: string;
  officer_rank: string;
  email: string;
  createdAt: string;
  PoliceStation?: {
    station_id: string;
    name: string;
  };
}

interface Station {
  station_id: string;
  name: string;
}

const OfficerList: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [officers, setOfficers] = useState<Officer[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [stationFilter, setStationFilter] = useState<string | undefined>();

  /* ================= FETCH STATIONS ================= */
  const fetchStations = async () => {
    try {
      const res = await apiRequest<{ data: Station[] }>(
        "GET",
        `${apiUrl}/api/stations/`,
      );
      setStations(res.data || []);
    } catch {
      toast.error("Failed to load stations");
    }
  };

  /* ================= FETCH OFFICERS ================= */
  const fetchOfficers = async (query?: string) => {
    try {
      setLoading(true);
      const url = query
        ? `${apiUrl}/api/officers/search?q=${query}`
        : `${apiUrl}/api/officers/search`;

      const res = await apiRequest<{ data: Officer[] }>("GET", url);
      setOfficers(res.data || []);
    } catch {
      toast.error("Failed to fetch officers");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEBOUNCED SEARCH ================= */
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        fetchOfficers(value);
      }, 500),
    [],
  );

  useEffect(() => {
    fetchStations();
    fetchOfficers();
    return () => debouncedSearch.cancel();
  }, []);

  /* ================= DELETE ================= */
  const deleteOfficer = async (id: string) => {
    try {
      await apiRequest("DELETE", `${apiUrl}/api/officers/${id}`);
      toast.success("Officer deleted");
      fetchOfficers(searchText);
    } catch {
      toast.error("Failed to delete officer");
    }
  };

  /* ================= TABLE DATA FILTER ================= */
  const filteredOfficers = stationFilter
    ? officers.filter((o) => o.PoliceStation?.station_id === stationFilter)
    : officers;

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Rank",
      dataIndex: "officer_rank",
    },
    {
      title: "Badge No",
      dataIndex: "badge_no",
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Police Station",
      render: (_: any, record: Officer) => record.PoliceStation?.name || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Officer) => {
        const items = [
          { key: "update", label: "Update" },
          { key: "delete", label: "Delete" },
        ];

        const onClick = ({ key }: { key: string }) => {
          if (key === "delete") deleteOfficer(record.officer_id);
          if (key === "update") toast.info("Update not implemented yet");
        };

        return (
          <Dropdown menu={{ items, onClick }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Search officer"
          allowClear
          onChange={(e) => {
            setSearchText(e.target.value);
            debouncedSearch(e.target.value);
          }}
          style={{ width: 250 }}
        />

        <Select
          allowClear
          placeholder="Filter by station"
          style={{ width: 250 }}
          onChange={(value) => setStationFilter(value)}
        >
          {stations.map((s) => (
            <Select.Option key={s.station_id} value={s.station_id}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </Space>

      <Table
        rowKey="officer_id"
        columns={columns}
        dataSource={filteredOfficers}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default OfficerList;
