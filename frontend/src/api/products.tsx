import axiosInstance from "./axios-instance";
import axios, { AxiosResponse } from "axios";
import { ProductSearch } from "../types";

interface IFetchProducts {
    token: string;
    search: ProductSearch;
}
export const fetchProducts = (data: IFetchProducts) => {
    return axiosInstance({
        method: "GET",
        url: "/products",
        headers: {
            authorization: data.token,
        },
        params: data.search,
    }).then((response: AxiosResponse) => {
        console.log(response.data);
    });
};
