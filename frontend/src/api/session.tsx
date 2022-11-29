import axiosInstance from "./axios-instance";
import axios, { AxiosResponse } from "axios";

interface ISignIn {
    email: string;
    password: string;
}
export const signin = (data: ISignIn) => {
    return axiosInstance({
        method: "POST",
        url: "/token",
        data,
    }).then((response: AxiosResponse) => {
        return response.data;
    });
};

interface ISignOut {
    token: string;
}
export const signout = (data: ISignOut) => {
    return axiosInstance({
        method: "DELETE",
        url: "/token",
        headers: {
            authorization: data.token,
        },
    }).then(() => {});
};
