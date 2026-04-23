"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

type Notification = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: Date;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationBell() {
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(false);
  const { getToken, isSignedIn } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    if (!isSignedIn) return;
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    setNotifications(data.notifications ?? []);
  }

  async function markRead() {
    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications([]);
  }

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [isSignedIn]);

  useEffect(() => {
    async function checkPushStatus() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      setIsPushEnabled(!!existing);
    }
    if (isSignedIn) checkPushStatus();
  }, [isSignedIn]);

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });

    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    setIsPushEnabled(true);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open && notifications.length > 0) markRead();
        }}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </p>
          </div>
          {!isPushEnabled && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={enablePush}
                className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-2 transition-colors"
              >
                🔔 Enable push notifications
              </button>
            </div>
          )}
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              You're all caught up!
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="p-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
