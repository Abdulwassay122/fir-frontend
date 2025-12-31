import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { authStore, type Role } from "./auth";

interface Props {
  children: ReactNode;
  role: Role;
}

const ProtectedRoute = ({ children, role }: Props) => {
  console.log(authStore.role);
  //  Not logged in
  if (!authStore.role) {
    return <Navigate to={`/`} replace />;
  }

  //  Logged in but wrong role
  if (authStore.role !== role) {
    return <Navigate to={`/`} replace />;
  }

  //  Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
