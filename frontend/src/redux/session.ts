import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRoles } from "../types";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

interface ISessionState {
    token: string;
    role?: UserRoles;
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
            action: PayloadAction<{ token: string; role: UserRoles }>
        ) => {
            return {
                token: action.payload.token,
                role: action.payload.role,
            };
        },
        deleteSession: (state) => {
            return {
                token: "",
            };
        },
    },
});

export const { setSession, deleteSession } = sessionSlice.actions;
const persistConfig = {
    key: "session",
    storage,
};
export default persistReducer(persistConfig, sessionSlice.reducer);
