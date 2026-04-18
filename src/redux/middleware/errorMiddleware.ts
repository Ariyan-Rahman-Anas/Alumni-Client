import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const rtkQueryErrorLogger = () => (next: any) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const message =
      action.payload?.data?.message || "Something went wrong";

    toast.error(message);
  }

  return next(action);
};