import type { AppSettings, AuthSession, ScanRecord, UserAccount, UserRole } from "./types";

const KEYS = {
  scans: "aps_scans",
  users: "aps_users",
  session: "aps_session",
  loggedIn: "aps_logged_in",
  settings: (userId: string) => `aps_settings_${userId}`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ——— Auth ———
export function isLoggedIn(): boolean {
  return !!localStorage.getItem(KEYS.loggedIn) && !!getSession();
}

export function getSession(): AuthSession | null {
  return read<AuthSession | null>(KEYS.session, null);
}

export function setSession(session: AuthSession) {
  write(KEYS.session, session);
  localStorage.setItem(KEYS.loggedIn, "1");
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
  localStorage.removeItem(KEYS.loggedIn);
}

export function getCurrentUser(): UserAccount | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) ?? null;
}

// ——— Users ———
export function getUsers(): UserAccount[] {
  let users = read<UserAccount[]>(KEYS.users, []);
  if (users.length === 0) {
    users = [
      {
        id: "demo-user",
        email: "demo@university.edu",
        password: "demo1234",
        fullName: "Demo Student",
        role: "student",
        createdAt: new Date().toISOString(),
      },
      {
        id: "lecturer-user",
        email: "lecturer@university.edu",
        password: "lecturer1234",
        fullName: "Dr. Robert Carter",
        role: "lecturer",
        createdAt: new Date().toISOString(),
      },
      {
        id: "admin-user",
        email: "admin@university.edu",
        password: "admin1234",
        fullName: "Dr. Admin Williams",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ];
    saveUsers(users);
  } else {
    let updated = false;
    if (!users.some((u) => u.role === "admin")) {
      users.push({
        id: "admin-user",
        email: "admin@university.edu",
        password: "admin1234",
        fullName: "Dr. Admin Williams",
        role: "admin",
        createdAt: new Date().toISOString(),
      });
      updated = true;
    }
    if (!users.some((u) => u.role === "lecturer")) {
      users.push({
        id: "lecturer-user",
        email: "lecturer@university.edu",
        password: "lecturer1234",
        fullName: "Dr. Robert Carter",
        role: "lecturer",
        createdAt: new Date().toISOString(),
      });
      updated = true;
    }
    if (updated) {
      saveUsers(users);
    }
  }
  return users;
}

export function saveUsers(users: UserAccount[]) {
  write(KEYS.users, users);
}

export function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): { ok: boolean; error?: string; user?: UserAccount } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user: UserAccount = {
    id: crypto.randomUUID(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    fullName: data.fullName.trim(),
    role: data.role,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return { ok: true, user };
}

export function registerUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): { ok: boolean; error?: string } {
  const result = createUser(data);
  if (!result.ok || !result.user) return { ok: false, error: result.error };
  setSession({ userId: result.user.id, email: result.user.email });
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  let user = getUsers().find(
    (u) => u.email === email.trim().toLowerCase()
  );

  if (!user) {
    const emailLower = email.trim().toLowerCase();
    let role: UserRole = "student";
    let fullName = "Demo Student";

    if (emailLower.includes("admin")) {
      role = "admin";
      fullName = "Demo Admin";
    } else if (emailLower.includes("lecturer") || emailLower.includes("teacher") || emailLower.includes("prof")) {
      role = "lecturer";
      fullName = "Demo Lecturer";
    }

    const result = createUser({
      email: emailLower,
      password: password || "password123",
      fullName,
      role,
    });

    if (!result.ok || !result.user) {
      return { ok: false, error: result.error || "Login failed" };
    }
    user = result.user;
  }

  setSession({ userId: user.id, email: user.email });
  return { ok: true };
}

export function addUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): { ok: boolean; error?: string } {
  return createUser(data);
}

export function deleteUser(userId: string) {
  const session = getSession();
  saveUsers(getUsers().filter((u) => u.id !== userId));
  if (session?.userId === userId) clearSession();
}

export function countScansForUser(userId: string): number {
  return getScans().filter((s) => s.userId === userId).length;
}

// ——— Settings ———
const defaultSettings = (user: UserAccount): AppSettings => {
  const [first, ...rest] = user.fullName.split(" ");
  return {
    firstName: first || "",
    lastName: rest.join(" ") || "",
    email: user.email,
    emailNotifications: true,
    plagiarismAlerts: true,
    similarityThreshold: 40,
  };
};

export function getSettings(): AppSettings {
  const user = getCurrentUser();
  if (!user) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      emailNotifications: true,
      plagiarismAlerts: true,
      similarityThreshold: 40,
    };
  }
  return read(KEYS.settings(user.id), defaultSettings(user));
}

export function saveSettings(settings: AppSettings) {
  const user = getCurrentUser();
  if (!user) return;
  write(KEYS.settings(user.id), settings);
}

export function getSimilarityThreshold(): number {
  return getSettings().similarityThreshold;
}

// ——— Scans ———
export function getScans(): ScanRecord[] {
  return read<ScanRecord[]>(KEYS.scans, []);
}

export function getScansForCurrentUser(): ScanRecord[] {
  const session = getSession();
  if (!session) return [];
  return getScans()
    .filter((s) => s.userId === session.userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getScanById(id: string): ScanRecord | undefined {
  return getScans().find((s) => s.id === id);
}

export function saveScan(scan: ScanRecord) {
  const all = getScans();
  write(KEYS.scans, [scan, ...all]);
}

export function deleteScan(id: string) {
  write(
    KEYS.scans,
    getScans().filter((s) => s.id !== id)
  );
}

export function getDashboardStats(userId: string) {
  const scans = getScans().filter((s) => s.userId === userId);
  const total = scans.length;
  const flagged = scans.filter((s) => s.status === "flagged").length;
  const original = scans.filter((s) => s.status === "original").length;
  return { total, flagged, original };
}
