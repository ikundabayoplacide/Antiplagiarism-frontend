import { useState, useEffect, useCallback } from "react";
import { apiGetNotifications, apiMarkNotificationRead, type ApiNotification } from "@/lib/api";

export function useNotifications(role: "student" | "lecturer" | "admin") {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);

  useEffect(() => {
    apiGetNotifications(role).then(setNotifications).catch(() => {});
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(async (id: string) => {
    await apiMarkNotificationRead(role, id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, [role]);

  const markAllRead = useCallback(async () => {
    await apiMarkNotificationRead(role, "all").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [role]);

  return { notifications, unreadCount, markRead, markAllRead };
}
