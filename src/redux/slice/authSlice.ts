import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    approvalStatus: string;
    isVerified: boolean;
    imageUrl?: string;
    batch?: number;
}

interface AuthState {
    user: AuthUser | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
             state.isInitialized = true;
        },
        clearUser(state) {
            state.user = null;
             state.isInitialized = true; 
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => Boolean(state.auth.user);
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;