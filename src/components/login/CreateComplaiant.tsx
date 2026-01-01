import CreateComplainant from "../officer/components/AddComplainant";
import { theme } from "antd";

export default function CreateComplaiant() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className={`min-h-screen py-10`} style={{ background: colorBgContainer }}>
      <CreateComplainant />
    </div>
  );
}
