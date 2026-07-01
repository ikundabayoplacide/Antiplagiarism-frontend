import { getScans, getUsers } from "./storage";

export type DocumentStatus = "pending" | "processing" | "completed" | "failed";
export type PlagiarismLevel = "low" | "medium" | "high";

export interface AdminStat {
  title: string;
  count: number;
  trend: number;
  trendUp: boolean;
}

export interface AdminDocument {
  id: string;
  title: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocumentStatus;
}

export interface SimilarityResult {
  id: string;
  documentName: string;
  comparedWith: string;
  similarityPercent: number;
}

export interface ChartPoint {
  month: string;
  value: number;
}

export interface PlagiarismStatPoint {
  name: string;
  low: number;
  medium: number;
  high: number;
}

export interface UserActivityPoint {
  day: string;
  students: number;
  lecturers: number;
  admins: number;
}

const SEED_DOCUMENTS: AdminDocument[] = [
  { id: "DOC-1042", title: "Machine Learning in Healthcare Research", uploadedBy: "Sarah Mitchell", uploadDate: "2026-06-14T09:30:00Z", status: "completed" },
  { id: "DOC-1041", title: "Climate Change Impact on Coastal Ecosystems", uploadedBy: "James Okafor", uploadDate: "2026-06-14T08:15:00Z", status: "processing" },
  { id: "DOC-1040", title: "Quantum Computing Applications in Cryptography", uploadedBy: "Emily Chen", uploadDate: "2026-06-13T16:45:00Z", status: "completed" },
  { id: "DOC-1039", title: "Sustainable Urban Planning Strategies", uploadedBy: "Michael Torres", uploadDate: "2026-06-13T14:20:00Z", status: "completed" },
  { id: "DOC-1038", title: "Neural Networks for Natural Language Processing", uploadedBy: "Priya Sharma", uploadDate: "2026-06-12T11:00:00Z", status: "pending" },
  { id: "DOC-1037", title: "Renewable Energy Policy Analysis", uploadedBy: "David Kim", uploadDate: "2026-06-12T09:30:00Z", status: "failed" },
];

const SEED_SIMILARITY: SimilarityResult[] = [
  { id: "SIM-501", documentName: "Machine Learning in Healthcare Research", comparedWith: "IEEE Journal Vol. 42 (2024)", similarityPercent: 12 },
  { id: "SIM-500", documentName: "Climate Change Impact on Coastal Ecosystems", comparedWith: "Nature Climate Change Archive", similarityPercent: 38 },
  { id: "SIM-499", documentName: "Quantum Computing Applications", comparedWith: "MIT Research Repository", similarityPercent: 67 },
  { id: "SIM-498", documentName: "Sustainable Urban Planning Strategies", comparedWith: "Urban Studies Journal", similarityPercent: 8 },
  { id: "SIM-497", documentName: "Neural Networks for NLP", comparedWith: "ACM Digital Library", similarityPercent: 45 },
  { id: "SIM-496", documentName: "Renewable Energy Policy Analysis", comparedWith: "Energy Policy Review 2025", similarityPercent: 72 },
];

const DOCUMENTS_PER_MONTH: ChartPoint[] = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 65 },
  { month: "Apr", value: 78 },
  { month: "May", value: 91 },
  { month: "Jun", value: 104 },
];

const PLAGIARISM_STATS: PlagiarismStatPoint[] = [
  { name: "Jan", low: 28, medium: 10, high: 4 },
  { name: "Feb", low: 35, medium: 15, high: 8 },
  { name: "Mar", low: 40, medium: 18, high: 7 },
  { name: "Apr", low: 48, medium: 22, high: 8 },
  { name: "May", low: 55, medium: 26, high: 10 },
  { name: "Jun", low: 62, medium: 30, high: 12 },
];

const USER_ACTIVITY: UserActivityPoint[] = [
  { day: "Mon", students: 124, lecturers: 38, admins: 6 },
  { day: "Tue", students: 156, lecturers: 42, admins: 8 },
  { day: "Wed", students: 142, lecturers: 45, admins: 7 },
  { day: "Thu", students: 168, lecturers: 40, admins: 9 },
  { day: "Fri", students: 134, lecturers: 35, admins: 5 },
  { day: "Sat", students: 78, lecturers: 18, admins: 3 },
  { day: "Sun", students: 62, lecturers: 12, admins: 2 },
];

export function getPlagiarismLevel(percent: number): PlagiarismLevel {
  if (percent <= 20) return "low";
  if (percent <= 49) return "medium";
  return "high";
}

export function getPlagiarismLabel(level: PlagiarismLevel): string {
  const labels: Record<PlagiarismLevel, string> = {
    low: "Low Plagiarism",
    medium: "Medium Plagiarism",
    high: "High Plagiarism",
  };
  return labels[level];
}

export function getAdminStats(): AdminStat[] {
  const users = getUsers();
  const scans = getScans();
  const baseUsers = Math.max(users.length, 248);
  const baseDocs = Math.max(scans.length + SEED_DOCUMENTS.length, 1247);
  const baseChecks = Math.max(scans.length * 3 + 3891, 3891);
  const baseReports = Math.max(scans.length + 856, 856);

  return [
    { title: "Total Users", count: baseUsers, trend: 12.5, trendUp: true },
    { title: "Total Uploaded Documents", count: baseDocs, trend: 8.3, trendUp: true },
    { title: "Total Plagiarism Checks", count: baseChecks, trend: 15.2, trendUp: true },
    { title: "Total Reports Generated", count: baseReports, trend: 3.1, trendUp: false },
  ];
}

export function getRecentDocuments(limit = 6): AdminDocument[] {
  const scans = getScans();
  const fromScans: AdminDocument[] = scans.slice(0, 3).map((s, i) => ({
    id: `DOC-${1000 + i}`,
    title: s.fileName.replace(/\.[^.]+$/, ""),
    uploadedBy: getUsers().find((u) => u.id === s.userId)?.fullName ?? "Unknown User",
    uploadDate: s.createdAt,
    status: s.status === "flagged" ? "completed" : "completed",
  }));
  return [...fromScans, ...SEED_DOCUMENTS].slice(0, limit);
}

export function getAllDocuments(): AdminDocument[] {
  return getRecentDocuments(20);
}

export function getRecentSimilarityResults(limit = 6): SimilarityResult[] {
  const scans = getScans();
  const fromScans: SimilarityResult[] = scans.slice(0, 2).map((s, i) => ({
    id: `SIM-${500 + i}`,
    documentName: s.fileName.replace(/\.[^.]+$/, ""),
    comparedWith: s.matchedSections[0]?.source ?? "University Repository",
    similarityPercent: s.plagiarismPercent,
  }));
  return [...fromScans, ...SEED_SIMILARITY].slice(0, limit);
}

export function getAllSimilarityResults(): SimilarityResult[] {
  return getRecentSimilarityResults(20);
}

export function getDocumentsPerMonth(): ChartPoint[] {
  return DOCUMENTS_PER_MONTH;
}

export function getPlagiarismDetectionStats(): PlagiarismStatPoint[] {
  return PLAGIARISM_STATS;
}

export function getUserActivityOverview(): UserActivityPoint[] {
  return USER_ACTIVITY;
}

export const ADMIN_NOTIFICATIONS = [
  { id: 1, title: "High plagiarism detected", message: "DOC-1037 flagged at 72% similarity", time: "5 min ago" },
  { id: 2, title: "New user registered", message: "Emily Chen joined as Student", time: "1 hour ago" },
  { id: 3, title: "Report generated", message: "Plagiarism report for DOC-1042 ready", time: "2 hours ago" },
];
