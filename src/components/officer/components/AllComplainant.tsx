// src/components/complainant/ComplainantTable.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Spin, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { apiRequest } from "../../../utils/apiRequest";
import { toast } from "react-toastify";
import { debounce } from "lodash";

interface Complainant {
  complainant_id: string;
  name: string;
  phone: string;
  email: string;
  cnic: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

const ComplainantTable: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<Complainant[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchComplainants = async (query = "") => {
    try {
      setLoading(true);
      const res = await apiRequest<{ data: Complainant[] }>(
        "GET",
        `${apiUrl}/api/complainants?q=${query}`
      );
      setData(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch complainants");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((val: string) => fetchComplainants(val), 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedFetch(e.target.value);
  };

  const deleteComplainant = async (id: string) => {
    try {
      await apiRequest("DELETE", `${apiUrl}/api/complainants/${id}`);
      toast.success("Complainant deleted successfully");
      fetchComplainants(search);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete complainant");
    }
  };

  useEffect(() => {
    fetchComplainants();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
      key: "cnic",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Complainant) => {
        const items = [
          {
            key: "delete",
            label: "Delete",
          },
          {
            key: "update",
            label: "Update",
          },
        ];

        const handleMenuClick = ({ key }: { key: string }) => {
          if (key === "delete") {
            deleteComplainant(record.complainant_id);
          } else if (key === "update") {
            toast.info("Update not implemented");
          }
        };

        return (
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search complainants"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />

      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="complainant_id" />
      )}
    </div>
  );
};

export default ComplainantTable;
