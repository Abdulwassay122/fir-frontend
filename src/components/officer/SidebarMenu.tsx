import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileAddOutlined,
  FileTextOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const sidebarItems: MenuProps["items"] = [
  {
    key: "",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "register-fir",
    icon: <FileAddOutlined />,
    label: "Register FIR",
  },
  {
    key: "all-fir",
    icon: <FileTextOutlined />,
    label: "FIR List",
  },
  {
    key: "add-complainant",
    icon: <UsergroupAddOutlined />,
    label: "Add Complainant",
  },
  {
    key: "all-complainant",
    icon: <FileTextOutlined />,
    label: "Complainant List",
  },
  {
    key: "add-officer",
    icon: <UserAddOutlined />,
    label: "Add Officer",
  },
  {
    key: "all-officers",
    icon: <FileTextOutlined />,
    label: "Officers List",
  },
  {
    key: "add-station",
    icon: <FileAddOutlined />,
    label: "Add Station",
  },
  {
    key: "all-stations",
    icon: <FileTextOutlined />,
    label: "Stations List",
  },
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
];

const BASE_PATH = "/officer/dashboard";

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.replace(`${BASE_PATH}/`, "");

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey || ""]}
      onClick={({ key }) => navigate(`${BASE_PATH}/${key}`)}
      style={{ height: "100%", borderRight: 0 }}
      items={sidebarItems}
    />
  );
};

export default SidebarMenu;
