import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Card, Space, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";

const { Search } = Input;

interface Station {
  station_id: string;
  name: string;
  district: string;
  city: string;
  province: string;
  createdAt: string;
  updatedAt: string;
}

const StationList: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH STATIONS ================= */
  const fetchStations = async (query?: string) => {
    try {
      setLoading(true);
      const url = query
        ? `${apiUrl}/api/stations?q=${query}`
        : `${apiUrl}/api/stations`;

      const res = await apiRequest<{ data: Station[] }>("GET", url);
      setStations(res.data || []);
    } catch {
      toast.error("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEBOUNCED SEARCH ================= */
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        fetchStations(value);
      }, 500),
    []
  );

  useEffect(() => {
    fetchStations();
    return () => debouncedSearch.cancel();
  }, []);

  /* ================= DELETE ================= */
  const deleteStation = async (id: string) => {
    try {
      await apiRequest("DELETE", `${apiUrl}/api/stations/${id}`);
      toast.success("Station deleted successfully");
      fetchStations(searchText);
    } catch {
      toast.error("Failed to delete station");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Station Name",
      dataIndex: "name",
    },
    {
      title: "District",
      dataIndex: "district",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "Province",
      dataIndex: "province",
    },
    {
      title: "Created At",
      render: (_: any, record: Station) =>
        new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Station) => {
        const items = [
          { key: "update", label: "Update" },
          { key: "delete", label: "Delete" },
        ];

        const onClick = ({ key }: { key: string }) => {
          if (key === "delete") deleteStation(record.station_id);
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
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search station"
          allowClear
          style={{ width: 300 }}
          onChange={(e) => {
            setSearchText(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
      </Space>

      <Table
        rowKey="station_id"
        columns={columns}
        dataSource={stations}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default StationList;
