import { createContext } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../services";

export const socket = io(SOCKET_URL);

export const CommonContext = createContext<any>({});
