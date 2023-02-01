  export const API_URL:string = import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_DEVELOPMENT_API_URL: import.meta.env.VITE_DEPLOYMENT_API_URL

  export const SOCKET_URL = import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_DEVELOPMENT_SOCKET_URL: import.meta.env.VITE_DEPLOYMENT_SOCKET_URL