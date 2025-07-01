"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function SessionTimeout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (warningId) clearTimeout(warningId);

      // Set warning timeout
      warningId = setTimeout(() => {
        toast.warning(
          "Your session will expire in 5 minutes. Please save your work."
        );
      }, TIMEOUT_DURATION - WARNING_DURATION);

      // Set logout timeout
      timeoutId = setTimeout(() => {
        signOut({ redirect: true, callbackUrl: "/login" });
        toast.error("Your session has expired. Please log in again.");
      }, TIMEOUT_DURATION);
    };

    // Reset timer on user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (warningId) clearTimeout(warningId);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [session]);

  return null;
}
