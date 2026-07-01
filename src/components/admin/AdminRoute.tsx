import { Navigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "@/lib/storage";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
