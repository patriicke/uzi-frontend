import axios from "axios";
import { API_URL } from "../services";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
