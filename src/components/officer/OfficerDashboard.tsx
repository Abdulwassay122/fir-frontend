import React from "react";
import { Layout, Switch, theme } from "antd";
import { Routes, Route } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

import Dashboard from "./components/Dashboard";
import RegisterFIR from "./components/RegisterFIR";
import AllFIRs from "./components/AllFIRs";
import AddOfficer from "./components/AddOfficer";
import AddStation from "./components/AddStation";
import AllOfficers from "./components/AllOfficers";
import AllStations from "./components/AllStations";
import Profile from "./components/Profile";
import AddComplainant from "./components/AddComplainant";
import AllComplainant from "./components/AllComplainant";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import FIRDetail from "./components/FIRDetail";
import NotFound from "../caomplainants/NotFound";

interface AppProps {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
}
const { Header, Content, Footer, Sider } = Layout;

const App: React.FC<AppProps> = ({ isDark, toggleTheme }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => console.log("Breakpoint:", broken)}
        onCollapse={(collapsed, type) =>
          console.log("Collapsed:", collapsed, type)
        }
      >
        <div className="demo-logo-vertical" />
        <SidebarMenu />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 24,
            background: colorBgContainer,
          }}
        >
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Header>

        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="register-fir" element={<RegisterFIR />} />
              <Route path="all-fir" element={<AllFIRs />} />
              <Route path="add-officer" element={<AddOfficer />} />
              <Route path="add-complainant" element={<AddComplainant />} />
              <Route path="all-complainant" element={<AllComplainant />} />
              <Route path="add-station" element={<AddStation />} />
              <Route path="all-officers" element={<AllOfficers />} />
              <Route path="all-stations" element={<AllStations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="fir-detail/:fir_id" element={<FIRDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          SMIU Police ©{new Date().getFullYear()} Created by{" "}
          <a
            href="https://porfolio-lac-seven.vercel.app/"
            target="_blank"
            // className="text-[ff0000] font-bold"
          >
            Abdul Wassay
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
