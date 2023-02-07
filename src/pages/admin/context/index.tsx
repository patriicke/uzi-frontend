import {
  useState,
  useMemo,
  createContext,
  FC,
  ReactNode,
  useEffect
} from "react";
import { createUserAdmin, getDataBaseStatus } from "../hooks";
import { IMessageType } from "../pages/MessagesPage";
import { IRoomType } from "../pages/RoomsPage";
import { IUserType } from "../pages/UsersPage";

export const AdminContext = createContext<any>({});

export type IDatabaseStatus = {
  numberOfUsers: number;
  numberOfMessages: number;
  numberOfRooms: number;
};

export type IAdminContext = {
  messages: IMessageType[];
  setMessages: Function;
  rooms: IRoomType[];
  setRooms: Function;
  users: IUserType[];
  setUsers: Function;
  databaseStatus: IDatabaseStatus;
  setDatabaseStatus: Function;
  showCreateUser: boolean;
  setShowCreateUser: Function;
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
  const [showCreateUser, setShowCreateUser] = useState<boolean>(false);

  const getDatabase = async () => {
    try {
      const data = await getDataBaseStatus();
      setDatabaseStatus(data);
    } catch (error) {}
  };

  useEffect(() => {
    getDatabase();
  }, []);
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
        setDatabaseStatus,
        showCreateUser,
        setShowCreateUser
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
