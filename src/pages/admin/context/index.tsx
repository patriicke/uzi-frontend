import { useState, useMemo, createContext, FC, ReactNode } from "react";
import { IMessageType } from "../pages/MessagesPage";
import { IRoomType } from "../pages/RoomsPage";
import { IUserType } from "../pages/UsersPage";

export const AdminContext = createContext<any>({});

export type IAdminContext = {
  messages: IMessageType[];
  setMessages: Function;
  rooms: IRoomType[];
  setRooms: Function;
  users: IUserType[];
  setUsers: Function;
  databaseStatus: IDatabaseStatus;
  setDatabaseStatus: Function;
};

export type IDatabaseStatus = {
  numberOfUsers: number;
  numberOfMessages: number;
  numberOfRooms: number;
};

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<IMessageType[]>([]);
  const [rooms, setRooms] = useState<IRoomType[]>([]);
  const [users, setUsers] = useState<IUserType[]>([]);
  const [databaseStatus, setDatabaseStatus] = useState<IDatabaseStatus>({
    numberOfUsers: 0,
    numberOfMessages: 0,
    numberOfRooms: 0
  });
  return (
    <AdminContext.Provider
      value={{
        messages,
        setMessages,
        rooms,
        setRooms,
        users,
        setUsers,
        databaseStatus,
        setDatabaseStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
