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
        localStorage.setItem("token", response.data.token);
        axiosInstance.defaults.headers["Authorization"] = response.data.token;
        return response.data;
    });
};

export const signout = () => {
    return axiosInstance({
        method: "DELETE",
        url: "/token",
    }).then(() => {
        localStorage.removeItem("token");
        axiosInstance.defaults.headers["Authorization"] = "";
    });
};
