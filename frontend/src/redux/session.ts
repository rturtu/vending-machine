import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRoles } from "../types";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

interface ISessionState {
    token: string;
    role?: UserRoles;
    userId?: number;
    balance?: number;
}

const initialState: ISessionState = {
    token: "",
};

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSession: (
            state,
            action: PayloadAction<{
                token: string;
                role: UserRoles;
                userId: number;
                balance: number;
            }>
        ) => {
            return action.payload;
        },
        deleteSession: (state) => {
            return {
                token: "",
            };
        },
        setBalance: (state, action: PayloadAction<{ balance: number }>) => {
            return {
                ...state,
                balance: action.payload.balance,
            };
        },
    },
});

export const { setSession, deleteSession, setBalance } = sessionSlice.actions;
const persistConfig = {
    key: "session",
    storage,
};
export default persistReducer(persistConfig, sessionSlice.reducer);
