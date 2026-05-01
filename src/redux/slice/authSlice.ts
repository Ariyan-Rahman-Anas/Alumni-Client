import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IAuthState, IAuthUser } from "@/app/(auth)/auth.types";

const initialState: IAuthState = {
    user: null,
    accessToken: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ user: IAuthUser; accessToken: string }>) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isInitialized = true;
        },
        clearUser(state) {
            state.user = null;
            state.accessToken = null;
            state.isInitialized = true;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => Boolean(state.auth.user);
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;