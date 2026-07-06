export type UserRole = "student" | "lecturer" | "admin";

export interface MatchedSection {
  text: string;
  source: string;
  similarity: number;
}

export interface ScanRecord {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  plagiarismPercent: number;
  originalPercent: number;
  wordCount: number;
  status: "original" | "flagged";
  matchedSections: MatchedSection[];
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface AppSettings {
  firstName: string;
  lastName: string;
  email: string;
  emailNotifications: boolean;
  plagiarismAlerts: boolean;
  similarityThreshold: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}
