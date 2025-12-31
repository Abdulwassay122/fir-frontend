import React from "react";
import { Result, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../auth/auth";

const NotFound: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const role = authStore.role;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colorBgContainer,
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate(`/${role}/dashboard`)}>
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
