export const API_URL: string = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : "https://uzi-backend-production.up.railway.app/api/v1";

export const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://uzi-backend-production.up.railway.app";
