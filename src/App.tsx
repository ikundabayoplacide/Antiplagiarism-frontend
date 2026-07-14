import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/components/theme-provider";
import Index from "./pages/Index";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Platform from "./pages/Platform";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadCheck from "./pages/UploadCheck";
import ScanHistory from "./pages/ScanHistory";
import PlagiarismResults from "./pages/PlagiarismResults";
import SubmissionHistory from "./pages/SubmissionHistory";
import Reports from "./pages/Reports";
import ManageUsers from "./pages/ManageUsers";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Imports
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSimilarity from "./pages/admin/AdminSimilarity";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminLecturers from "./pages/admin/AdminLecturers";

// Lecturer Imports
import LecturerRoute from "./components/lecturer/LecturerRoute";
import LecturerLayout from "./layouts/LecturerLayout";
import LecturerDashboardPage from "./pages/lecturer/LecturerDashboardPage";
import LecturerProjectsPage from "./pages/lecturer/LecturerProjectsPage";
import LecturerReportsPage from "./pages/lecturer/LecturerReportsPage";
import LecturerAlertsPage from "./pages/lecturer/LecturerAlertsPage";
import LecturerStudentsPage from "./pages/lecturer/LecturerStudentsPage";
import LecturerDownloadsPage from "./pages/lecturer/LecturerDownloadsPage";
import LecturerProfilePage from "./pages/lecturer/LecturerProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            {/* Public Marketing Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/upload" element={<ProtectedRoute><UploadCheck /></ProtectedRoute>} />
            <Route path="/dashboard/documents" element={<ProtectedRoute><ScanHistory /></ProtectedRoute>} />
            <Route path="/dashboard/results" element={<ProtectedRoute><PlagiarismResults /></ProtectedRoute>} />
            <Route path="/dashboard/history" element={<ProtectedRoute><SubmissionHistory /></ProtectedRoute>} />
            <Route path="/dashboard/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/dashboard/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
            <Route path="/admin/lecturers" element={<AdminRoute><AdminLecturers /></AdminRoute>} />
            <Route path="/admin/documents" element={<AdminRoute><AdminDocuments /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/similarity" element={<AdminRoute><AdminSimilarity /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

            {/* Lecturer Dashboard Routes */}
            <Route path="/lecturer" element={<LecturerRoute><LecturerLayout /></LecturerRoute>}>
              <Route index element={<LecturerDashboardPage />} />
              <Route path="projects" element={<LecturerProjectsPage />} />
              <Route path="reports" element={<LecturerReportsPage />} />
              <Route path="alerts" element={<LecturerAlertsPage />} />
              <Route path="students" element={<LecturerStudentsPage />} />
              <Route path="downloads" element={<LecturerDownloadsPage />} />
              <Route path="profile" element={<LecturerProfilePage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
