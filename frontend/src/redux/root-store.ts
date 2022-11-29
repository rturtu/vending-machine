import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./session";
import productsReducer from "./products";
import { persistStore } from "redux-persist";

const rootStore = configureStore({
    reducer: {
        session: sessionReducer,
        products: productsReducer,
    },
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;

export default rootStore;

export const persistor = persistStore(rootStore);
