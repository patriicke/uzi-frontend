import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CommonContext } from "../../context";
import GIF from "./../../assets/gif.png";
import SendIcon from "./../../assets/send.svg";
import EmojiPicker from "emoji-picker-react";
import { sender } from "../../hooks";
import { api } from "../../api/api";
import { filterMessage } from "../../utils/filter.message";
import { ICommonContext } from "../../types/common.context";
import { useParams } from "react-router-dom";
import { ICONS } from "../../assets";

const ChatComponent: React.FC = () => {
  const { room: searchRoom } = useParams();

  const [message, setMessage] = useState("");
  const user = useSelector((state: any) => state.user.userData);
  const [users, setUsers] = useState([]);

  const {
    socket,
    setMessages,
    setCurrentRoom,
    currentRoom,
    messages,
    rooms,
    setShowSideBar,
    fullScreen,
    setFullScreen
  } = useContext<ICommonContext>(CommonContext);

  const messageEndRef: any = useRef(null);

  useEffect(() => {
    setCurrentRoom(searchRoom);
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUsers = async () => {
    try {
      const request = await api.get("/user/all");
      const response = request.data;
      setUsers(response.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages: any) => {
    console.log(roomMessages);
    setMessages(roomMessages);
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = searchRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }

  const [showEmojiFile, setShowEmojiFile] = useState(false);

  const onEmojiClick = (event: any, emojiData: any) => {
    let msg = message;
    msg = msg + `${emojiData.emoji}`;
    setMessage(msg);
  };

  const emojiElement: any = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", () => {
      if (!emojiElement.current?.contains(event?.target))
        setShowEmojiFile(false);
    });
  }, [showEmojiFile]);

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
    let dateArray: string[] = date.split("/");
    const month: number = Number(dateArray[0]) - 1;
    const day = dateArray[1];
    const year = dateArray[2];
    return `${day} ${months[month]} ${year}`;
  };

  const themes: string[] = [
    "bg-white",
    "bg-green-50",
    "bg-green-100",
    "bg-green-200"
  ];

  const [chatTheme, setChatTheme] = useState<string>("white");

  useEffect(() => {
    if (localStorage.getItem("chatTheme")) {
      setChatTheme(localStorage.getItem("chatTheme") ?? "white");
    }
  }, []);

  return (
    <div className='px-3 flex flex-col gap-2 w-full py-1'>
      <div className='h-[8%] w-full border flex items-center px-5 justify-between'>
        <div className='flex items-center gap-4'>
          <div
            className='cursor-pointer z-30 md:hidden'
            onClick={() => {
              setShowSideBar(true);

              console.log("click");
            }}
          >
            <i className='fa-solid fa-bars text-2xl'></i>
          </div>
          <img
            src={
              rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                ?.roomImage === "icon"
                ? ICONS.RoomIcon
                : rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                    ?.roomImage
            }
            alt='RoomImage'
            className='w-12'
          />
          <div className='flex flex-col'>
            <span className='font-semibold text-xl'>
              {rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                ?.roomName ?? ""}
            </span>
            <span className='text-gray-500 text-sm'>
              #{searchRoom}{" "}
              {rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                ?.access ? (
                <span className='font-semibold'>
                  (
                  {
                    rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                      ?.access
                  }
                  )
                </span>
              ) : (
                ""
              )}
              <span className='pl-2 font-bold'>
                {rooms
                  .filter((room: any) => room.roomCode == searchRoom)[0]
                  ?.users?.find(
                    (currentRoom: any) =>
                      currentRoom.userId == user._id &&
                      currentRoom.role === "ADMIN"
                  )
                  ? "GROUP ADMIN"
                  : ""}
              </span>
            </span>
          </div>
        </div>
        <div className='hidden md:flex flex-row gap-2'>
          {themes.map((theme) => (
            <span
              className={`${theme} w-8 h-8 shadow-xl rounded-full border-2 cursor-pointer`}
              key={theme}
              onClick={() => {
                setChatTheme(theme);
                localStorage.setItem("chatTheme", theme);
              }}
            />
          ))}
          <div className='flex items-center justify-center px-2'>
            <span onClick={() => setFullScreen(!fullScreen)}>
              {fullScreen ? (
                <i className='fa-solid fa-compress text-xl cursor-pointer' />
              ) : (
                <i className='fa-solid fa-expand text-xl cursor-pointer' />
              )}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`h-[84%] w-full flex-shrink flex flex-col overflow-auto p-3 scroll-smooth ${chatTheme}`}
        ref={messageEndRef}
      >
        {(messages as []).map(({ _id, messagesByDate }, index: number) => (
          <div key={index} className='flex flex-col gap-[0.4em]'>
            {(messagesByDate as []).map((data: any, index) => {
              return (
                <div key={index}>
                  <div
                    key={index}
                    className={`flex ${
                      sender(data?.from, users)?._id === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className={`px-2  break-words max-w-[70%] flex gap-1`}>
                      <div>
                        <div
                          className={`flex items-end gap-2  
                     ${
                       sender(data?.from, users)?._id === user?._id
                         ? "flex-row-reverse"
                         : ""
                     }
                        `}
                        >
                          <span
                            id='message'
                            className={`${
                              sender(data?.from, users)?._id === user?._id
                                ? "bg-primary-500 text-white rounded-l-2xl "
                                : "bg-[#F5F5F5] rounded-r-2xl"
                            } text-[1rem] p-4 px-5 font-light flex flex-col ${
                              (messagesByDate[index - 1] as any)?.time !==
                                (messagesByDate[index] as any)?.time &&
                              sender(data?.from, users)?._id === user?._id
                                ? "rounded-tr-2xl"
                                : "rounded-tl-2xl"
                            }
                          `}
                          >
                            {filterMessage(data?.content)}
                          </span>
                          <span className='text-[12px] align-bottom mb-1 font-semibold text-primary-500'>
                            {sender(data?.from, users)?.fullname}
                          </span>
                        </div>
                        {(messagesByDate[index - 1] as any)?.time !==
                        (messagesByDate[index] as any)?.time ? (
                          <div
                            className={`text-[0.8rem] font-medium opacity-50 flex
                             ${
                               sender(data?.from, users)?._id === user?._id
                                 ? "justify-end"
                                 : "justify-start"
                             }
                            `}
                          >
                            {`${formatDate(_id)} ${data?.time}`}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <form
        className='h-[8%] w-full border flex px-3 justify-between gap-2 bg-white'
        onSubmit={handleSubmit}
      >
        <div className='flex gap-2 w-[10%] items-center justify-center'>
          <i className='fa-solid fa-image text-primary-500 text-[1.62em] cursor-pointer'></i>
          <img src={GIF} alt='gif' className='w-7 h-6 cursor-pointer' />
        </div>
        <div className='w-[83%] flex items-center justify-center'>
          <div className='border w-full h-4/6 rounded-[2em] p-2 px-5 flex justify-between items-center hover:border-primary-500 relative'>
            <input
              type='text'
              className='w-[96%] outline-none border-none'
              placeholder='Start a new message'
              disabled={!user}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              className='cursor-pointer'
              onClick={() => {
                setShowEmojiFile((current) => !current);
              }}
            >
              <i className='fa-regular fa-face-smile text-[1.5em] text-primary-500 cursor-pointer'></i>
            </div>
            {showEmojiFile && (
              <div className='absolute bottom-[4em] right-0' ref={emojiElement}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
        <button
          className='w-[5%] h-full flex items-center justify-center'
          type='submit'
        >
          <img src={SendIcon} alt='send_icon' className='cursor-pointer w-6' />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
