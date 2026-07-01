import { Navigate } from "react-router-dom";
import { isLoggedIn } from "@/lib/storage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
