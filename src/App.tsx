import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import HomePage from "./pages/Home/HomePage";
import "react-toastify/dist/ReactToastify.css";
import { CommonContext } from "./context";
import AuthComponent from "./components/Auth/AuthComponent";
import SelectRoom from "./pages/Select/SelectRoom";
import { socket } from "./context";
import ChatInterface from "./pages/Chat/ChatInterface";
import CreateRoomModal from "./components/Modal/CreateRoomModal";
import SideBarResponsive from "./components/SideBar/SideBarResponsive";
import { useWhoAmI } from "./hooks/user";
import CreatePublicUserModal from "./components/Modal/CreatePublicUserModal";
export const ProductContext: any = createContext({});

const App = () => {
  const { room } = useParams();
  const [loginPage, setLoginPage] = useState<boolean>(false);
  const [signup, setSignup] = useState<string>("login");
  const [rooms, setRooms] = useState<[]>([]);
  const [currentRoom, setCurrentRoom] = useState(room);
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
  const { whoAmI } = useWhoAmI();

  useEffect(() => {
    setCurrentRoom(room);
  });

  useEffect(() => {
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
        setCreatePublicUserShow
      }}
    >
      <>
        <div
          className={`${
            loginPage &&
            "blur-[4px] select-none cursor-none pointer-events-none "
          } overflow-auto h-screen min-h-screen overflow-x-hidden`}
        >
          <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/select' element={<SelectRoom />} />
              <Route path='/chat/:room' element={<ChatInterface />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <SideBarResponsive />
          </Router>
        </div>
        <ToastContainer
          position='top-right'
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
        <AuthComponent />
        <CreateRoomModal />
        <CreatePublicUserModal />
      </>
    </CommonContext.Provider>
  );
};

export default App;
