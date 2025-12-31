import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = (value: boolean) => {
    setIsDark(value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      }}
    >
      <App isDark={isDark} toggleTheme={toggleTheme} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
      />
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
