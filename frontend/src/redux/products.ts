import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductSearch } from "../types";

interface IProductsState {
    list: Product[];
}

const initialState: IProductsState = {
    list: [],
};

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        appendProducts: (
            state,
            action: PayloadAction<{ products: Product[] }>
        ) => {
            return {
                list: [...state.list, ...action.payload.products],
            };
        },
        setProducts: (
            state,
            action: PayloadAction<{ products: Product[] }>
        ) => {
            return {
                list: [...action.payload.products],
            };
        },
    },
});

export const { appendProducts, setProducts } = productsSlice.actions;
export default productsSlice.reducer;
