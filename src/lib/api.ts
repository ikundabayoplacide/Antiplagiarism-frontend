import axios from "axios";
import type { UserRole } from "./types";
import { getToken } from "./storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export class ApiError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

function toApiError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    throw new ApiError(data?.message || "Something went wrong.", data?.field);
  }
  throw err;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiRegister(payload: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
}): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>("/auth/register", payload);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Student Scans ———
export interface ApiScan {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  wordCount: number;
  plagiarismPercent: number;
  originalPercent: number;
  status: "original" | "flagged";
  matchedSections: { text: string; source: string; similarity: number }[];
  createdAt: string;
}

export interface ApiStudentStats {
  total: number;
  original: number;
  flagged: number;
  reports: number;
  avgSimilarity: number;
}

export async function apiUploadScan(file: File): Promise<ApiScan> {
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<ApiScan>("/student/scans", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetScans(): Promise<ApiScan[]> {
  try {
    const { data } = await api.get<ApiScan[]>("/student/scans");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetScan(id: string): Promise<ApiScan> {
  try {
    const { data } = await api.get<ApiScan>(`/student/scans/${id}`);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiDeleteScan(id: string): Promise<void> {
  try {
    await api.delete(`/student/scans/${id}`);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetStudentStats(): Promise<ApiStudentStats> {
  try {
    const { data } = await api.get<ApiStudentStats>("/student/stats");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Admin ———
export interface ApiAdminStats {
  totalUsers: number;
  totalDocuments: number;
  totalChecks: number;
  totalReports: number;
}

export interface ApiAdminDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface ApiSimilarityResult {
  id: string;
  documentName: string;
  comparedWith: string;
  similarityPercent: number;
}

export interface ApiChartPoint {
  month: string;
  value: number;
}

export interface ApiPlagiarismStat {
  name: string;
  low: number;
  medium: number;
  high: number;
}

export interface ApiUserActivity {
  day: string;
  students: number;
  lecturers: number;
  admins?: number;
}

export interface ApiNotification {
  id: string | number;
  title: string;
  message: string;
  time: string;
}

export async function apiGetUsers(): Promise<ApiUser[]> {
  try {
    const { data } = await api.get<ApiUser[]>("/admin/users");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiCreateAdminUser(payload: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
  department?: string;
}): Promise<ApiUser> {
  try {
    const { data } = await api.post<ApiUser>("/admin/users", payload);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiUpdateAdminUser(id: string, payload: {
  fullName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  department?: string;
}): Promise<ApiUser> {
  try {
    const { data } = await api.put<ApiUser>(`/admin/users/${id}`, payload);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiDeleteAdminUser(id: string): Promise<void> {
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAdminStats(): Promise<ApiAdminStats> {
  try {
    const { data } = await api.get<ApiAdminStats>("/admin/stats");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAdminDocuments(): Promise<ApiAdminDocument[]> {
  try {
    const { data } = await api.get<ApiAdminDocument[]>("/admin/documents");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAdminSimilarity(): Promise<ApiSimilarityResult[]> {
  try {
    const { data } = await api.get<ApiSimilarityResult[]>("/admin/similarity");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetDocumentsPerMonth(): Promise<ApiChartPoint[]> {
  try {
    const { data } = await api.get<ApiChartPoint[]>("/admin/documents-per-month");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetPlagiarismStats(): Promise<ApiPlagiarismStat[]> {
  try {
    const { data } = await api.get<ApiPlagiarismStat[]>("/admin/plagiarism-stats");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetUserActivity(): Promise<ApiUserActivity[]> {
  try {
    const { data } = await api.get<ApiUserActivity[]>("/admin/user-activity");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAdminNotifications(): Promise<ApiNotification[]> {
  try {
    const { data } = await api.get<ApiNotification[]>("/admin/notifications");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Lecturer ———
export async function apiGetLecturerScans(): Promise<ApiScan[]> {
  try {
    const { data } = await api.get<ApiScan[]>("/lecturer/scans");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Lecturer Reports ———
export interface LecturerReport {
  id: string;
  title: string;
  fileSize: number;
  studentName: string;
  studentId: string;
  studentEmail: string;
  dateSubmitted: string;
  similarityPercent?: number;
  wordCount?: number;
  status?: "Low" | "Medium" | "High";
}

export async function apiGetLecturerReports(): Promise<LecturerReport[]> {
  try {
    const { data } = await api.get<LecturerReport[]>("/lecturer/reports");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Assignments ———
export interface LecturerProject {
  id: string;
  title: string;
  fileSize: number;
  studentName: string;
  studentId: string;
  studentEmail: string;
  dateSubmitted: string;
  similarityPercent?: number;
  wordCount?: number;
  status?: "Low" | "Medium" | "High";
}

export async function apiGetLecturerProjects(): Promise<LecturerProject[]> {
  try {
    const { data } = await api.get<(LecturerProject & { createdAt?: string; submittedAt?: string })[]>("/lecturer/projects");
    return data.map((p) => ({
      ...p,
      dateSubmitted: p.dateSubmitted ?? p.submittedAt ?? p.createdAt,
    }));
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetLecturerStudents(): Promise<ApiUser[]> {
  try {
    const { data } = await api.get<ApiUser[]>("/lecturer/students");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export interface ApiAssignment {
  id: string;
  lecturerId: string;
  studentId: string;
  lecturer?: ApiUser;
  student?: ApiUser;
  createdAt: string;
}

export async function apiGetAssignments(): Promise<ApiAssignment[]> {
  try {
    const { data } = await api.get<ApiAssignment[]>("/admin/assignments");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiAssignStudent(lecturerId: string, studentId: string): Promise<ApiAssignment> {
  try {
    const { data } = await api.post<ApiAssignment>("/admin/assign", { lecturerId, studentId });
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiUnassignStudent(assignmentId: string): Promise<void> {
  try {
    await api.delete(`/admin/unassign/${assignmentId}`);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAssignmentsByLecturer(lecturerId: string): Promise<ApiAssignment[]> {
  try {
    const { data } = await api.get<ApiAssignment[]>(`/admin/assignments/${lecturerId}/students`);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Notifications ———
export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export async function apiGetNotifications(role: "student" | "lecturer" | "admin"): Promise<ApiNotification[]> {
  try {
    const { data } = await api.get<ApiNotification[]>(`/${role}/notifications`);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiMarkNotificationRead(role: "student" | "lecturer" | "admin", id: string): Promise<void> {
  try {
    await api.patch(`/${role}/notifications/${id}/read`);
  } catch (err) {
    toApiError(err);
  }
}

// ——— Settings ———
export interface ApiSettings {
  fullName: string;
  email: string;
  emailNotifications: boolean;
  plagiarismAlerts: boolean;
  similarityThreshold: number;
}

export async function apiGetSettings(): Promise<ApiSettings> {
  try {
    const { data } = await api.get<ApiSettings>("/settings");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiUpdateSettings(payload: Partial<ApiSettings>): Promise<ApiSettings> {
  try {
    const { data } = await api.put<ApiSettings>("/settings", payload);
    return data;
  } catch (err) {
    toApiError(err);
  }
}
