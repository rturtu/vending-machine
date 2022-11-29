import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token") || ""}`, // initial state
    },
});

export default axiosInstance;
