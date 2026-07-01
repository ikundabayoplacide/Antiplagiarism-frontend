import { Navigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "@/lib/storage";

const LecturerRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  if (!user || user.role !== "lecturer") {
    // If not a lecturer, send them to their role's home or main dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default LecturerRoute;
