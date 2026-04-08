"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/redux/apis/authApi";
import { setUser, clearUser } from "@/redux/authSlice";
import type { AppDispatch } from "@/redux/store";

/**
 * Runs silently at app root. On every page load/refresh it calls GET /auth/me
 * using the httpOnly accessToken cookie. If valid, populates Redux auth state.
 * If 401 (expired/missing), the baseQueryWithReauth will try refresh-token cookie
 * automatically. If both fail, clearUser is dispatched.
 */
const AuthInitializer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, isSuccess, isError } = useGetMeQuery();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setUser(data.data));
        }
        if (isError) {
            dispatch(clearUser());
        }
    }, [isSuccess, isError, data, dispatch]);

    return null;
};

export default AuthInitializer;
