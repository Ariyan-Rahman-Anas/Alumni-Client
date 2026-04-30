"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRestoreSessionQuery } from "@/redux/apis/authApi";
import type { AppDispatch } from "@/redux/store";
import { clearUser, setUser } from "@/redux/slice/authSlice";

/**
 * Runs silently at app root on every page load.
 * Calls POST /auth/refresh-token using the httpOnly refresh-token cookie.
 * On success: stores { user, accessToken } in Redux (in-memory only — never localStorage).
 * On failure (no cookie / expired): clears auth state.
 * The in-memory accessToken is then passed as Bearer header for all API calls and socket auth.
 */
const AuthInitializer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, isSuccess, isError } = useRestoreSessionQuery();

    useEffect(() => {
        if (isSuccess && data?.data?.accessToken && data?.data?.user) {
            dispatch(setUser({ user: data.data.user, accessToken: data.data.accessToken }));
        }
        if (isError) {
            dispatch(clearUser());
        }
    }, [isSuccess, isError, data, dispatch]);

    return null;
};

export default AuthInitializer;
