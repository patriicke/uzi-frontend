import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "/favicon.png";
import Person from "./../../assets/person.png";
import { useDispatch, useSelector } from "react-redux";
import { CommonContext } from "../../context";
import { api } from "../../api/api";
import { Link, useParams } from "react-router-dom";
import { setRoomsRedux } from "../../redux/slices/roomSlice";
import { ICONS } from "../../assets";
import { useLogout } from "../../hooks/user";
import { ICommonContext } from "../../types/common.context";

const SideBarResponsive: React.FC = () => {
  const SIDEBAR_ELEMENT: any = useRef(null);
  const { room: searchRoom } = useParams();
  const user = useSelector((state: any) => state.user.userData);
  const [showLogout, setShowLogout] = useState(false);
  const [search, setSearch] = useState("");
  const [finalRooms, setFinalRooms] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const dispatch = useDispatch();
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const { logoutUser } = useLogout();

  const {
    socket,
    setMembers,
    setCurrentRoom,
    setRooms,
    rooms,
    currentRoom,
    setCreateRoomShow,
    setLoginPage
  } = useContext<ICommonContext>(CommonContext);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  const formatDate = (date: string): string => {
    if (!date) return "";
    let dateArray: string[] = date.split("/");
    const month: number = Number(dateArray[0]) - 1;
    const day = dateArray[1];
    return `${months[month]} ${day}`;
  };

  function joinRoom(room: any) {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", {
      roomToJoin: room,
      currentRoom: currentRoom
    });
    setCurrentRoom(room);
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom(searchRoom);
      getRooms();
      socket.emit("join-room", {
        roomToJoin: searchRoom,
        currentRoom: currentRoom
      });
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload: any) => {
    setMembers(payload);
  });

  async function getRooms() {
    const request = await api.get("/room/all");
    const response = await request.data;
    setRooms(response.rooms);
    dispatch(setRoomsRedux(response.rooms));
  }

  useEffect(() => {
    setFinalRooms(rooms);
  }, [rooms, searchRoom]);

  useEffect(() => {
    if (!search) {
      setFinalRooms(rooms);
      return;
    }
    setFinalRooms(
      rooms?.filter((room: any) => {
        return room.roomName.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search]);

  useEffect(() => {
    getAllMessages();
  }, []);

  const getAllMessages = async () => {
    try {
      const request = await api.get("/message/all");
      const response = await request.data;
      setAllMessages(response.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const clickEvent = () => {
      if (!SIDEBAR_ELEMENT.current?.contains(event?.target))
        setShowSideBar(false);
    };
    document.addEventListener("mousedown", clickEvent);
    return () => document.removeEventListener("mousedown", clickEvent);
  }, [SIDEBAR_ELEMENT]);

  return (
    <div
      className={`absolute z-50 top-0 ${
        showSideBar ? "translate-x-0" : "-translate-x-[20em]"
      } duration-200`}
      ref={SIDEBAR_ELEMENT}
    >
      <div
        className={`relative h-screen w-[20em] bg-slate-100 shadow-xl p-5 md:hidden flex flex-col gap-8 border-r border-slate-300 `}
      >
        <div className='flex justify-between items-center'>
          <Link className='flex items-center gap-2' to={"/"}>
            <img src={Logo} alt='logo' className='w-8' />
            <h1 className='text-primary-500 text-xl font-semibold'>Uzi Chat</h1>
          </Link>
          <i
            className='fa-sharp fa-solid fa-xmark text-xl cursor-pointer'
            onClick={() => {
              setShowSideBar(false);
            }}
          ></i>
        </div>
        <div className='flex flex-col gap-2 overflow-auto'>
          <div className='flex justify-between px-2 items-center'>
            <h1 className='text-lg font-semibold'>Rooms</h1>
            {user.token && (
              <button
                className='p-2 bg-primary-500 text-white px-3 rounded-lg'
                onClick={() => {
                  if (!user.token) setLoginPage(true);
                  else setCreateRoomShow(true);
                }}
              >
                Create Room
              </button>
            )}
          </div>
          <div className='h-11 w-full border border-slate-400 rounded-[2em] p-2 px-4 flex items-center gap-2'>
            <i className='fa-solid fa-magnifying-glass cursor-pointer'></i>
            <input
              type='text'
              className='w-[95%] outline-none border-none bg-inherit text-gray-800'
              placeholder='Search group name here'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          {user.token && (
            <div className='flex gap-2 flex-col overflow-auto max-h-[75%]'>
              {finalRooms?.map((room: any) => {
                return (
                  <Link
                    className={`flex gap-2 items-center justify-between hover:bg-gray-200 p-1 px-2 pr-3 rounded-md cursor-pointer   ${
                      searchRoom === room.roomCode && "bg-gray-300"
                    } duration-200`}
                    key={room._id}
                    to={`/chat/${room.roomCode}`}
                    onClick={() => {
                      joinRoom(room.roomCode);
                      setShowSideBar(false);
                    }}
                  >
                    <div className='flex gap-2 items-center font-semibold'>
                      <img
                        src={
                          room.roomImage === "icon"
                            ? ICONS.RoomIcon
                            : room.roomImage
                        }
                        alt={room.roomName}
                        className='w-12 min-w-12 max-w-12 rounded-full border-2 border-gray-300 object-fit'
                      />
                      <h1 className='text-sm'>{room.roomName}</h1>
                    </div>
                    <span className='text-sm text-gray-500'>
                      #{room.roomCode}
                    </span>
                    <span className='text-sm text-gray-400'>
                      {formatDate(
                        (
                          allMessages?.filter((message: any) => {
                            return message.to === room.roomCode;
                          })[
                            allMessages?.filter((message: any) => {
                              return message.to === room.roomCode;
                            }).length - 1
                          ] as any
                        )?.date
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {user.token && (
          <div className='absolute bottom-3 w-full h-14 right-0 px-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img
                src={user.profileImage === "icon" ? Person : user.profileImage}
                alt={user.fullname}
                className='w-12 h-12 rounded-full'
              />
              <div className='flex flex-col'>
                <h1 className='font-semibold'>{user.fullname}</h1>
                <span className='text-sm text-gray-600'>@{user.username}</span>
              </div>
            </div>
            <div className='relative'>
              {showLogout && (
                <div className='h-[3em] w-[7em] absolute -top-[4em] right-0 bg-white shadow-md flex items-center justify-center rounded-md'>
                  <button
                    className='text-[12px] text-white bg-primary-500 p-2 font-semibold rounded-md'
                    onClick={logoutUser}
                  >
                    LOGOUT
                  </button>
                </div>
              )}

              <i
                className={`fa-solid fa-ellipsis text-2xl cursor-pointer ${
                  showLogout ? "rotate-90" : "rotate-0"
                } duration-300 ease-linear`}
                onClick={() => setShowLogout((cur) => !cur)}
              ></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarResponsive;
