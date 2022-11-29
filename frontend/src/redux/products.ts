import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductSearch } from "../types";
import { filterUnique } from "../utils";

interface IProductsState {
    list: Product[];
    count: number;
}

const initialState: IProductsState = {
    list: [],
    count: 0,
};

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        appendProducts: (
            state,
            action: PayloadAction<{ products: Product[]; increment?: number }>
        ) => {
            console.log("productSlice appendProducts", state, action);
            return {
                ...state,
                list: filterUnique([...state.list, ...action.payload.products]),
                count: state.count + (action.payload.increment || 0),
            };
        },
        setProducts: (
            state,
            action: PayloadAction<{ products: Product[]; count?: number }>
        ) => {
            console.log("productSlice setProducts", state, action);
            return {
                ...state,
                list: [...action.payload.products],
                count: action.payload.count || action.payload.products.length,
            };
        },
        editProduct: (state, action: PayloadAction<{ product: Product }>) => {
            console.log("productSlice editProduct", state, action);
            return {
                ...state,
                list: state.list.map((product: Product) =>
                    product.id === action.payload.product.id
                        ? action.payload.product
                        : product
                ),
            };
        },
        deleteProduct: (
            state,
            action: PayloadAction<{ productId: number; decrement?: number }>
        ) => {
            return {
                ...state,
                list: state.list.filter(
                    (product: Product) =>
                        product.id !== action.payload.productId
                ),
                count: state.count - (action.payload.decrement || 0),
            };
        },
    },
});

export const { appendProducts, setProducts, editProduct, deleteProduct } =
    productsSlice.actions;
export default productsSlice.reducer;
