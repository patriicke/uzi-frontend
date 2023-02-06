import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "/favicon.png";
import Person from "./../../assets/person.png";
import { useDispatch, useSelector } from "react-redux";
import { CommonContext } from "../../context";
import { api } from "../../api/api";
import { Link, useParams } from "react-router-dom";
import { setRoomsRedux } from "../../redux/slices/roomSlice";
import { ICommonContext } from "../../types/common.context";
import { ICONS } from "../../assets";
import { useLogout } from "../../hooks/user";
import { ROLE } from "../../lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { IRoomType } from "../../pages/admin/pages/RoomsPage";
import axios from "axios";

const SideBar: React.FC = () => {
  const { room: searchRoom } = useParams();

  const user = useSelector((state: any) => state.user.userData);
  const [showLogout, setShowLogout] = useState(false);
  const [search, setSearch] = useState("");
  const [finalRooms, setFinalRooms] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [showDrop, setShowDrop] = useState<boolean>(false);

  const DROP_ELEMENT_SHARE = useRef<any>(null);

  const dispatch = useDispatch();
  const { logoutUser } = useLogout();

  const {
    socket,
    setMembers,
    currentRoom,
    setCurrentRoom,
    setCreateRoomShow,
    setLoginPage,
    fullScreen,
    setLeaveRoomData,
    setLeaveRoomShow
  } = useContext<ICommonContext>(CommonContext);

  const { rooms } = useSelector((state: any) => state.room);

  function joinRoom(roomToJoin: any) {
    setCurrentRoom(roomToJoin);
    socket.emit("join-room", {
      roomToJoin,
      currentRoom
    });
  }

  const leaveRoom = (room: IRoomType) => {
    setLeaveRoomData(room);
    setLeaveRoomShow(true);
  };

  useEffect(() => {
    setFinalRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    if (user.token) {
      getRooms();
      joinRoom(searchRoom);
      setCurrentRoom(searchRoom);
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload: any) => {
    setMembers(payload);
  });

  async function getRooms() {
    if (!localStorage.getItem("token")) return;
    const request = await api.get("/room/all");
    const response = await request.data;
    dispatch(setRoomsRedux(response.rooms));
  }

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
    if (!localStorage.getItem("token")) return;
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
      if (!DROP_ELEMENT_SHARE.current?.contains(event?.target))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", clickEvent);
    return () => document.removeEventListener("mousedown", clickEvent);
  }, [DROP_ELEMENT_SHARE]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  const shareRoom = (roomCode: string) => {
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = searchRoom;
    socket.emit(
      "message-room",
      roomId,
      `${window.location.origin}/room/join/${roomId}`,
      user,
      time,
      getFormattedDate()
    );
  };

  return (
    <div className={`${fullScreen && "hidden"}`}>
      <div
        className={`hidden w-1/5 md:min-w-[20em] lg:min-w-[25em] h-screen bg-slate-100 shadow-xl p-5 md:flex flex-col gap-8 relative border-r border-slate-300 duration-200`}
      >
        <Link className='flex items-center gap-2' to={"/"}>
          <img src={Logo} alt='logo' className='w-10 rounded-full' />
          <h1 className='text-primary-500 text-xl font-semibold'>Uzi Chat</h1>
        </Link>
        <div className='flex flex-col gap-2 overflow-auto h-[87%]'>
          <div className='flex justify-between px-2 items-center'>
            <h1 className='text-lg font-semibold'>Available Rooms </h1>
            {user.token && user.role === ROLE.ADMIN && (
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
          <div className='h-11 w-full border border-slate-400 rounded-[2em] p-2 px-4 flex items-center gap-2 relative'>
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
            <div className='flex gap-2 flex-col overflow-scroll h-full'>
              {finalRooms?.map((room: any) => {
                return (
                  <Link
                    className={`flex gap-2 items-center justify-between hover:bg-gray-200 p-1 px-2 pr-3 rounded-md cursor-pointer  ${
                      currentRoom === room.roomCode && "bg-gray-300"
                    } duration-200`}
                    key={room._id}
                    to={`/chat/${room.roomCode}`}
                    onClick={() => joinRoom(room.roomCode)}
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
                    <span
                      className='relative'
                      onClick={() => {
                        setShowDrop(!showDrop);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEllipsis}
                        onClick={() => {
                          setShowDrop(true);
                        }}
                        className='z-20'
                      />
                      {currentRoom === room?.roomCode && showDrop && (
                        <span
                          className='w-36 py-3 absolute bg-secondary-500 border shadow-sm h-28 right-0 z-50 flex flex-col p-2 gap-2 text-xs font-medium top-[calc(100%_+_3px)]'
                          ref={DROP_ELEMENT_SHARE}
                        >
                          <button
                            className='bg-primary-500 text-secondary-500 rounded-md p-2'
                            onClick={() => {
                              shareRoom(room.roomCode);
                            }}
                          >
                            SHARE
                          </button>
                          <button
                            className='bg-primary-500 text-secondary-500 rounded-md p-2'
                            onClick={() => {
                              leaveRoom(room);
                            }}
                          >
                            LEAVE
                          </button>
                        </span>
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
                    onClick={() => {
                      logoutUser();
                    }}
                  >
                    LOGOUT
                  </button>
                </div>
              )}
              <FontAwesomeIcon
                icon={faEllipsis}
                className={`text-2xl cursor-pointer ${
                  showLogout ? "rotate-90" : "rotate-0"
                } duration-300 ease-linear`}
                onClick={() => setShowLogout((cur) => !cur)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
