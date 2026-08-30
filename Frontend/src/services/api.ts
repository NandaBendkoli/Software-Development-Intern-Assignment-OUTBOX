import axios from "axios";

const api = axios.create({
  baseURL: "https://reachinbox-backend1-1d5j.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;