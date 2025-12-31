import React from "react";
import { Menu } from "antd";
import { FileTextOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const sidebarItems: MenuProps["items"] = [
  {
    key: "/",
    icon: <FileTextOutlined />,
    label: "FIR List",
  },
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
];

const BASE_PATH = "/complainant/dashboard";

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.replace(`${BASE_PATH}/`, "");

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey || "/"]}
      onClick={({ key }) => navigate(`${BASE_PATH}/${key}`)}
      style={{ height: "100%", borderRight: 0 }}
      items={sidebarItems}
    />
  );
};

export default SidebarMenu;
