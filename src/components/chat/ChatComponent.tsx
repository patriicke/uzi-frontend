import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CommonContext } from "../../context";
import EmojiPicker from "emoji-picker-react";
import { sender } from "../../hooks";
import { api } from "../../api/api";
import { filterMessage } from "../../utils/filter.message";
import { ICommonContext } from "../../types/common.context";
import { useParams } from "react-router-dom";
import { ICONS } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCompress,
  faExpand,
  faFaceSmile,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import { format } from "../../utils";

const ChatComponent: React.FC = () => {
  const { room: searchRoom } = useParams();

  const [message, setMessage] = useState("");
  const user = useSelector((state: any) => state.user.userData);
  const [users, setUsers] = useState([]);
  const { rooms } = useSelector((state: any) => state.room);

  const {
    socket,
    setMessages,
    setCurrentRoom,
    messages,
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

  const styles = {
    backgroundImage: `url(/default_bg.jpg)`,
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center"
  };

  const documentElement = document.documentElement;

  const openFullScreen = () => {
    documentElement.requestFullscreen();
    setFullScreen(true);
  };

  const closeFullScreen = () => {
    try {
      document.exitFullscreen();
      setFullScreen(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (fullScreen) openFullScreen();
    else closeFullScreen();
  }, [fullScreen]);

  return (
    <div className='flex flex-col gap-2 w-full bg-primary-500'>
      <div
        className={`${
          fullScreen && "hidden"
        } h-[8%] w-full border-b flex items-center px-1 lg:px-5 justify-between`}
      >
        <div className='flex items-center gap-4'>
          <div
            className='cursor-pointer z-30 md:hidden'
            onClick={() => {
              setShowSideBar(true);
            }}
          >
            <FontAwesomeIcon icon={faBars} className='text-2xl' />
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
            <span className='font-semibold text-xl text-secondary-500'>
              {rooms.filter((room: any) => room.roomCode == searchRoom)[0]
                ?.roomName ?? ""}
            </span>
            <span className='text-secondary-500 text-sm'>
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
          <div className='flex items-center justify-center px-2'>
            <span onClick={() => setFullScreen(!fullScreen)}>
              <FontAwesomeIcon
                icon={faExpand}
                className='text-xl cursor-pointer text-secondary-500'
              />
            </span>
          </div>
        </div>
      </div>
      <div
        className={`h-[84%] w-full flex-shrink flex flex-col overflow-auto p-3 px-1 lg:px-3 scroll-smooth relative`}
        ref={messageEndRef}
        style={styles}
      >
        {fullScreen && (
          <FontAwesomeIcon
            icon={faCompress}
            className='text-secondary-500 text-2xl cursor-pointer sticky top-0 z-50'
            onClick={() => {
              setFullScreen(false);
            }}
          />
        )}
        {(messages as []).map(({ _id, messagesByDate }, index: number) => (
          <div key={index} className='flex flex-col gap-[0.4em] relative'>
            <span
              className={"text-center text-secondary-500 font-medium text-sm"}
            >
              {format.formatMessageDate(_id)}
            </span>
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
                    <div className={`break-words max-w-[70%] flex gap-1`}>
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
                            className={`bg-secondary-500 ${
                              sender(data?.from, users)?._id === user?._id
                                ? "rounded-l-2xl "
                                : " rounded-r-2xl"
                            } text-[0.9rem] p-3 font-medium flex flex-col ${
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
                          <span className='text-[12px] align-bottom mb-1 font-semibold text-secondary-500'>
                            {sender(data?.from, users)?.fullname}
                          </span>
                        </div>
                        {(messagesByDate[index - 1] as any)?.time !==
                        (messagesByDate[index] as any)?.time ? (
                          <span
                            className={`text-[0.8rem] font-medium opacity-50 flex text-secondary-500
                             ${
                               sender(data?.from, users)?._id === user?._id
                                 ? "justify-end"
                                 : "justify-start"
                             }
                            `}
                          >
                            {`${formatDate(_id)} ${data?.time}`}
                          </span>
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
        className='h-[8%] w-full border-t px-3 flex xl:px-56 justify-between gap-2 bg-primary-500'
        onSubmit={handleSubmit}
      >
        <div className='w-[95%] flex items-center justify-center'>
          <div className='border w-full h-4/5 rounded-[2em] p-2 px-5 flex justify-between items-center relative'>
            <input
              type='text'
              className='w-[96%] outline-none bg-inherit text-secondary-500'
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
              <FontAwesomeIcon
                icon={faFaceSmile}
                className='text-[1.5em] text-secondary-500 cursor-pointer'
              />
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
          <FontAwesomeIcon
            icon={faPaperPlane}
            className='cursor-pointer text-2xl text-secondary-500'
          />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
