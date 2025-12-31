import React from "react";
import { Layout, Switch, theme } from "antd";
import { Routes, Route } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import FIRList from "./components/AllFIRs";
import Profile from "./components/Profile";
import FIRDetail from "./components/FIRDetail";
import NotFound from "./NotFound";

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
              <Route path="/" element={<FIRList />} />
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
          , M.Hamza, Manthan
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
