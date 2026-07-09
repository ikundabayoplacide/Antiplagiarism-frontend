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

// ——— Documents ———
export interface ApiDocument {
  id: string;
  fileName?: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  content?: string;
}

function getMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
  };
  return map[ext ?? ""] || "application/octet-stream";
}

export async function apiUploadDocument(file: File): Promise<ApiDocument> {
  try {
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    const fileType = file.type || getMimeType(file.name);
    form.append("fileType", fileType);
    const { data } = await api.post<ApiDocument>("/documents", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ...data, fileName: data.fileName ?? file.name };
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetUsers(): Promise<ApiUser[]> {
  try {
    const { data } = await api.get<ApiUser[]>("/admin/users");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetDocuments(): Promise<ApiDocument[]> {
  try {
    const { data } = await api.get<ApiDocument[]>("/documents");
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetDocument(id: string): Promise<ApiDocument> {
  try {
    const { data } = await api.get<ApiDocument>(`/documents/${id}`);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiDeleteDocument(id: string): Promise<void> {
  try {
    await api.delete(`/documents/${id}`);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiUpdateDocument(id: string, payload: { file?: File; fileName?: string }): Promise<ApiDocument> {
  try {
    const form = new FormData();
    if (payload.file) {
      form.append("file", payload.file);
      form.append("fileType", payload.file.type || getMimeType(payload.file.name));
    }
    if (payload.fileName) form.append("fileName", payload.fileName);
    const { data } = await api.put<ApiDocument>(`/documents/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Assignments ———
export interface LecturerProject {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  dateSubmitted: string;
  similarityPercent: number;
  wordCount: number;
  status: "Low" | "Medium" | "High";
}

export async function apiGetLecturerProjects(): Promise<LecturerProject[]> {
  try {
    const { data } = await api.get<LecturerProject[]>("/lecturer/my-students/projects");
    return data;
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
    const { data } = await api.post<ApiAssignment>("/admin/assignments", { lecturerId, studentId });
    return data;
  } catch (err) {
    toApiError(err);
  }
}

export async function apiUnassignStudent(assignmentId: string): Promise<void> {
  try {
    await api.delete(`/admin/assignments/${assignmentId}`);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiGetAssignmentsByLecturer(lecturerId: string): Promise<ApiAssignment[]> {
  try {
    const { data } = await api.get<ApiAssignment[]>(`/admin/assignments/lecturer/${lecturerId}`);
    return data;
  } catch (err) {
    toApiError(err);
  }
}

// ——— Settings ———
export async function apiUpdateProfile(payload: { fullName?: string; email?: string }): Promise<void> {
  try {
    await api.put("/settings/profile", payload);
  } catch (err) {
    toApiError(err);
  }
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    await api.put("/settings/change-password", { currentPassword, newPassword });
  } catch (err) {
    toApiError(err);
  }
}

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
