import axiosInstance from "./axios-instance";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

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
        if (response.data.sessionCount > 0) {
            toast(
                `There are ${response.data.sessionCount} other active sessions`,
                { type: "error" }
            );
        }
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
