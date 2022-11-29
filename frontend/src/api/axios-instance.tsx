import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token") || ""}`, // initial state
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response.data.message;
        toast(message, { type: "error" });
    }
);

export default axiosInstance;
