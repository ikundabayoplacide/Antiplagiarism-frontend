import { getCurrentUser, getDashboardStats, getScansForCurrentUser, getSession } from "./storage";
import type { ScanRecord } from "./types";

export function getStudentStats() {
  const session = getSession();
  if (!session) {
    return { total: 0, original: 0, flagged: 0, reports: 0, avgSimilarity: 0 };
  }
  const stats = getDashboardStats(session.userId);
  const scans = getScansForCurrentUser();
  const avgSimilarity =
    scans.length > 0
      ? Math.round(scans.reduce((sum, s) => sum + s.plagiarismPercent, 0) / scans.length)
      : 0;

  return {
    total: stats.total,
    original: stats.original,
    flagged: stats.flagged,
    reports: scans.length,
    avgSimilarity,
  };
}

export function getRecentSubmissions(limit = 5): ScanRecord[] {
  return getScansForCurrentUser().slice(0, limit);
}

export function getPlagiarismResults(limit?: number): ScanRecord[] {
  const scans = getScansForCurrentUser();
  return limit ? scans.slice(0, limit) : scans;
}

export function getSubmissionHistory(): ScanRecord[] {
  return getScansForCurrentUser();
}

export function getStudentGreeting(): string {
  const user = getCurrentUser();
  return user?.fullName?.split(" ")[0] ?? "Student";
}

export function getPlagiarismLevel(percent: number): "low" | "medium" | "high" {
  if (percent <= 20) return "low";
  if (percent <= 49) return "medium";
  return "high";
}

export function getPlagiarismLabel(percent: number): string {
  const level = getPlagiarismLevel(percent);
  const labels = {
    low: "Low Plagiarism",
    medium: "Medium Plagiarism",
    high: "High Plagiarism",
  };
  return labels[level];
}

export const STUDENT_NOTIFICATIONS = [
  { id: 1, title: "Scan complete", message: "Your latest document analysis is ready", time: "10 min ago" },
  { id: 2, title: "Report available", message: "Download your plagiarism report anytime", time: "1 day ago" },
];
