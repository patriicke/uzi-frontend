import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { CommonContext } from "./context";
import AuthComponent from "./components/auth/AuthComponent";
import { socket } from "./context";
import SideBarResponsive from "./components/sidebar/SideBarResponsive";
import { useWhoAmI } from "./hooks/user";
import UserDefineRouter from "./Routes";
import Modal from "./components/modal";
import { IRoomType } from "./pages/admin/pages/RoomsPage";
export const ProductContext: any = createContext({});

const App = () => {
  const [loginPage, setLoginPage] = useState<boolean>(false);
  const [signup, setSignup] = useState<string>("login");
  const [rooms, setRooms] = useState<[]>([]);
  const [currentRoom, setCurrentRoom] = useState();
  const [members, setMembers] = useState<[]>([]);
  const [messages, setMessages] = useState<[]>([]);
  const [privateMemberMessages, setPrivateMemberMessages] = useState<[]>([]);
  const [newMessages, setNewMessages] = useState<[]>([]);
  const [showTabs, setShowTabs] = useState<string>("chat");
  const [createRoomShow, setCreateRoomShow] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [createPublicUserShow, setCreatePublicUserShow] =
    useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [joinRoomShow, setJoinRoomShow] = useState<boolean>(false);
  const [leaveRoomShow, setLeaveRoomShow] = useState<boolean>(false);
  const [joinRoomData, setJoinRoomData] = useState<IRoomType>();
  const [leaveRoomData, setLeaveRoomData] = useState<IRoomType>();

  const { whoAmI } = useWhoAmI();

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    whoAmI();
  }, []);

  return (
    <CommonContext.Provider
      value={{
        loginPage,
        setLoginPage,
        signup,
        setSignup,
        socket,
        rooms,
        setRooms,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        setMessages,
        privateMemberMessages,
        setPrivateMemberMessages,
        newMessages,
        setNewMessages,
        showTabs,
        setShowTabs,
        createRoomShow,
        setCreateRoomShow,
        showSideBar,
        setShowSideBar,
        fullScreen,
        setFullScreen,
        createPublicUserShow,
        setCreatePublicUserShow,
        isSidebarOpen,
        setIsSidebarOpen,
        joinRoomShow,
        setJoinRoomShow,
        leaveRoomShow,
        setLeaveRoomShow,
        joinRoomData,
        setJoinRoomData,
        leaveRoomData,
        setLeaveRoomData
      }}
    >
      <Router>
        <div
          className={`${
            loginPage &&
            "blur-[4px] select-none cursor-none pointer-events-none "
          } overflow-auto h-screen min-h-screen overflow-x-hidden`}
        >
          <UserDefineRouter />
          {window.innerWidth > 400 && <SideBarResponsive />}
        </div>
        <Modal />
      </Router>
    </CommonContext.Provider>
  );
};

export default App;
