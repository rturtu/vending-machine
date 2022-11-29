import axiosInstance from "./axios-instance";
import axios, { AxiosResponse } from "axios";

interface IDeposit {
    token: string;
    coin: number;
}
export const deposit = (data: IDeposit) => {
    return axiosInstance({
        method: "POST",
        url: "/deposit",
        data: {
            coin: data.coin,
        },
        headers: {
            authorization: data.token,
        },
    }).then((response: AxiosResponse) => {
        return response.data;
    });
};

interface IBuy {
    token: string;
    productId: number;
    amount: number;
}
export const buy = (data: IBuy) => {
    return axiosInstance({
        method: "POST",
        url: "/buy",
        data: {
            productId: data.productId,
            amount: data.amount,
        },
        headers: {
            authorization: data.token,
        },
    }).then((response: AxiosResponse) => {
        return response.data;
    });
};
