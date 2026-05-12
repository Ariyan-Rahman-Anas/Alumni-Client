import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

// Endpoints whose errors should not be shown as toasts.
// restoreSession is called on every page load for unauthenticated users and
// getting a 401 "Refresh token not found" is expected — not a user-visible error.
const SILENT_ENDPOINTS = new Set(["restoreSession"]);

export const rtkQueryErrorLogger = () => (next: any) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const endpointName: string | undefined = action.meta?.arg?.endpointName;
    if (!endpointName || !SILENT_ENDPOINTS.has(endpointName)) {
      const message =
        action.payload?.data?.message || "Something went wrong";
      console.error(`[RTK Error] ${endpointName ?? "unknown"}:`, action.payload);
      toast.error(message);
    }
  }
  return next(action);
};