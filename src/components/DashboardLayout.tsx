import { ReactNode } from "react";
import StudentLayout from "./student/StudentLayout";

const DashboardLayout = ({ children, title }: { children: ReactNode; title?: string }) => (
  <StudentLayout title={title}>{children}</StudentLayout>
);

export default DashboardLayout;
