import axiosInstance from "./axios-instance";
import axios, { AxiosResponse } from "axios";
import { ProductSearch, Product } from "../types";

interface IFetchProducts {
    token: string;
    search: ProductSearch;
}
export const fetchProducts = (data: IFetchProducts) => {
    console.log(data);
    return axiosInstance({
        method: "GET",
        url: "/products",
        headers: {
            authorization: data.token,
        },
        params: data.search,
    }).then((response: AxiosResponse) => {
        return response.data;
    });
};

interface IAddProduct {
    token: string;
    product: Product;
}
export const addProduct = (data: IAddProduct) => {
    return axiosInstance({
        method: data.product.id ? "PUT" : "POST",
        url: "/product" + (data.product.id ? `/${data.product.id}` : ""),
        headers: {
            authorization: data.token,
        },
        data: data.product,
    }).then((response: AxiosResponse) => {
        return response.data;
    });
};

interface IDeleteProduct {
    token: string;
    productId: number;
}
export const deleteProduct = (data: IDeleteProduct) => {
    return axiosInstance({
        method: "DELETE",
        url: `/product/${data.productId}`,
        headers: {
            authorization: data.token,
        },
    });
};
