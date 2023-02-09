import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonContext } from "../../context";
import EmojiPicker from "emoji-picker-react";
import { sender, uploadImage } from "../../hooks";
import { api } from "../../api/api";
import { filterMessage, verifyQRCodeImage } from "../../utils/filter.message";
import { ICommonContext } from "../../types/common.context";
import { useParams } from "react-router-dom";
import { ICONS } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBrush,
  faChevronDown,
  faCompress,
  faExpand,
  faFaceSmile,
  faImage,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

import { format } from "../../utils";
import { ChangeLinkToQRCode, ROLE } from "../../lib";
import { IRoomType } from "../../pages/admin/pages/RoomsPage";
import { IUserType } from "../../pages/admin/pages/UsersPage";
import ColorPicker from "react-pick-color";
import { toast } from "react-toastify";
import { updateUserRedux } from "../../redux/slices/userSlice";

export type ITheme = {
  image: boolean;
  color: boolean;
  content: string;
};

const ChatComponent: React.FC = () => {
  const { room: searchRoom } = useParams();

  const [message, setMessage] = useState("");
  const user = useSelector((state: any) => state.user.userData);
  const [users, setUsers] = useState([]);
  const { rooms } = useSelector((state: any) => state.room);
  const [dropShow, setDropShow] = useState(false);

  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const toastId: any = useRef(null);

  const dispatch = useDispatch();

  const [theme, setTheme] = useState<ITheme>({
    image: user?.chatTheme?.image,
    color: user?.chatTheme?.color,
    content: user?.chatTheme?.content
  });

  const validateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file: any = e.target.files == null ? null : e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (
        theme.color === user?.chatTheme?.color &&
        theme.image === user?.chatTheme?.image &&
        theme.content === user?.chatTheme?.content
      )
        return toast.warn("No changes to save");
      setLoading(true);
      if (theme.image === true && theme.content === previewImage) {
        toastId.current = toast.loading("Uploading image...");
        const imageUrl = await uploadImage(image);
        setTheme({
          ...theme,
          image: imageUrl
        });
      }
      const request = await api.patch("/user/theme", { theme });
      const data = await request.data;
      toast.update(toastId.current, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        delay: 2000
      });
      dispatch(
        updateUserRedux({
          ...user,
          ...data.user
        })
      );
    } catch (e) {
      toast.update(toastId.current, {
        render: "Failed to upload image!",
        type: "error",
        isLoading: false,
        delay: 2000
      });
    } finally {
      setLoading(false);
      setShowColorElement(false);
      setShowImageElement(false);
    }
  };

  const [showColorElement, setShowColorElement] = useState<boolean>(false);
  const [showImageElement, setShowImageElement] = useState<boolean>(false);

  const COLOR_ELEMENT: any = useRef(null);
  const IMAGE_ELEMENT: any = useRef(null);

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

  const deleteMessage = (messageId: string) => {
    socket.emit("delete-message", searchRoom, messageId);
  };

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
      if (!COLOR_ELEMENT.current?.contains(event?.target))
        setShowColorElement(false);
      if (!IMAGE_ELEMENT.current?.contains(event?.target))
        setShowImageElement(false);
    });
  }, [showEmojiFile, showColorElement, showImageElement]);

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
    backgroundImage: `url(${
      theme.image && theme.content == "default"
        ? !theme.color && "/default_bg.jpg"
        : theme.content
    })`,
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundColor: `${theme?.color && theme?.content}`
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

  useEffect(() => {
    if (color)
      setTheme({
        color: true,
        content: color,
        image: false
      });
  }, [color]);

  useEffect(() => {
    if (previewImage)
      setTheme({
        color: false,
        content: previewImage,
        image: true
      });
  }, [previewImage]);

  const revertChange = () => {
    setTheme({
      image: user?.chatTheme?.image,
      color: user?.chatTheme?.color,
      content: user?.chatTheme?.content
    });
  };

  const setToDefault = () => {
    setTheme({
      color: false,
      image: true,
      content: "default"
    });
  };

  return (
    <div className='flex flex-col w-full'>
      <div
        className={`${
          fullScreen && "hidden"
        } h-[8%] w-full border-b flex items-center px-1 lg:px-5 justify-between bg-primary-500`}
      >
        <div className='flex items-center gap-4'>
          <div
            className='cursor-pointer z-30 md:hidden'
            onClick={() => {
              setShowSideBar(true);
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              className='text-3xl text-white px-2'
            />
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
            <span className='text-secondary-500 text-sm'>#{searchRoom} </span>
          </div>
        </div>
        <div className='hidden md:flex flex-row gap-2'>
          <div className='flex items-center justify-center px-2 gap-4'>
            {user.role == ROLE.ADMIN && (
              <>
                <span className='relative'>
                  <FontAwesomeIcon
                    icon={faImage}
                    className='text-xl cursor-pointer text-secondary-500'
                    onClick={() => setShowImageElement(true)}
                  />
                  {showImageElement && (
                    <span
                      ref={IMAGE_ELEMENT}
                      className='absolute top-8 right-0 z-50 bg-secondary-500 rounded-md p-1 w-72'
                    >
                      <div className='flex justify-between gap-2 font-medium p-1 py-2'>
                        <button
                          className='w-1/3 py-1 bg-primary-500 text-white'
                          onClick={setToDefault}
                          disabled={loading}
                        >
                          DEFAULT
                        </button>
                        <button
                          className='w-1/3 py-1 bg-primary-500 text-white'
                          onClick={revertChange}
                          disabled={loading}
                        >
                          REVERT
                        </button>
                        <button
                          className='w-1/3 py-1 bg-primary-500 text-white'
                          onClick={handleSave}
                          disabled={loading}
                        >
                          SAVE
                        </button>
                      </div>
                      <div className='py-4 flex items-center justify-center'>
                        <label
                          htmlFor='choose-image'
                          className='font-medium bg-primary-500 text-secondary-500 px-3 p-1 rounded-sm'
                        >
                          CHOOSE IMAGE
                        </label>
                        <input
                          type='file'
                          onChange={validateImage}
                          id='choose-image'
                          accept='image/png, image/jpeg'
                          className='hidden'
                        />
                      </div>
                    </span>
                  )}
                </span>
                <span className='relative'>
                  <FontAwesomeIcon
                    icon={faBrush}
                    className='text-xl cursor-pointer text-secondary-500'
                    onClick={() => setShowColorElement(true)}
                  />
                  {showColorElement && (
                    <span
                      className='absolute top-8 right-0 z-50 bg-secondary-500 rounded-md p-1'
                      ref={COLOR_ELEMENT}
                    >
                      <div className='flex justify-between gap-2 font-medium p-1 py-2'>
                        <button
                          className='w-1/2 py-1 bg-primary-500 text-white'
                          onClick={revertChange}
                          disabled={loading}
                        >
                          REVERT
                        </button>
                        <button
                          className='w-1/2 py-1 bg-primary-500 text-white'
                          onClick={handleSave}
                          disabled={loading}
                        >
                          SAVE
                        </button>
                      </div>
                      <ColorPicker
                        color={color}
                        onChange={(color) => setColor(color.hex)}
                      />
                    </span>
                  )}
                </span>
              </>
            )}
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
        {(user as IUserType).role === ROLE.ADMIN && (
          <div
            className={`fixed ${
              fullScreen ? "top-2" : "top-20"
            } bg-white p-2 rounded-md w-fit`}
          >
            <a
              href={window.location.href}
              className='font-medium underline text-blue-500'
              target='_blank'
            >
              {window.location.href}
            </a>
            <img
              src={ChangeLinkToQRCode(window.location.href)}
              alt='QRCode'
              className='w-[350px] h-[350px] hidden lg:block'
            />
          </div>
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
                  {(user as IUserType).role === ROLE.ADMIN ? (
                    <div>
                      <div key={index} className={`flex justify-end`}>
                        <div className={`break-words max-w-[60%] flex gap-1`}>
                          <div>
                            <div
                              className={`flex items-end gap-2  flex-row-reverse`}
                            >
                              <span
                                id='message'
                                className={`bg-secondary-500  group rounded-l-2xl text-[0.9rem] p-4 font-medium flex flex-col ${
                                  (messagesByDate[index - 1] as any)?.time !==
                                    (messagesByDate[index] as any)?.time &&
                                  "rounded-tr-2xl"
                                }
                          `}
                                onMouseLeave={() => setDropShow(false)}
                              >
                                {verifyQRCodeImage(data?.content) ? (
                                  <span className='flex flex-col gap-1 '>
                                    <a
                                      href={data?.content}
                                      target={"_blank"}
                                      className='text-blue-600 underline'
                                    >
                                      {data?.content}
                                      <img
                                        src={ChangeLinkToQRCode(data?.content)}
                                        alt='QR Code'
                                        className='w-[350px] h-[350px] hid'
                                      />
                                    </a>
                                  </span>
                                ) : (
                                  <span className='flex gap-2 items-center justify-center'>
                                    <span className=''>
                                      {filterMessage(data?.content)}
                                    </span>
                                    {(data?.from?._id === user?._id ||
                                      rooms
                                        .find(
                                          (currRoom: IRoomType) =>
                                            currRoom.roomCode === searchRoom
                                        )
                                        ?.users?.find(
                                          (currUser: any) =>
                                            currUser.role === ROLE.ADMIN
                                        )?.userId === user?._id) && (
                                      <span className='hidden group-hover:flex cursor-pointer relative '>
                                        <FontAwesomeIcon
                                          icon={faChevronDown}
                                          onClick={() => setDropShow(!dropShow)}
                                        />
                                        {dropShow && (
                                          <span
                                            className={`bg-secondary-500 z-50 rounded-md border absolute top-[calc(100%_+_10px)] w-20 h-20 p-1 py-2 right-0
                                            }`}
                                          >
                                            <button
                                              className='text-secondary-500 bg-primary-500 p-1 rounded-md
                                      '
                                              onClick={() =>
                                                deleteMessage(data?._id)
                                              }
                                            >
                                              DELETE
                                            </button>
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </span>
                              <span className='text-[12px] align-bottom mb-1 font-semibold text-secondary-500'>
                                {sender(data?.from, users)?.fullname}
                              </span>
                            </div>
                            {(messagesByDate[index - 1] as any)?.time !==
                            (messagesByDate[index] as any)?.time ? (
                              <span
                                className={`text-[0.8rem] font-medium opacity-50 flex text-secondary-500
                                 justify-end`}
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
                  ) : (
                    <div
                      key={index}
                      className={`flex ${
                        sender(data?.from, users)?._id === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className={`break-words max-w-[60%] flex gap-1`}>
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
                              className={`bg-secondary-500  group ${
                                sender(data?.from, users)?._id === user?._id
                                  ? "rounded-l-2xl "
                                  : " rounded-r-2xl"
                              } text-[0.9rem] p-4 font-medium flex flex-col ${
                                (messagesByDate[index - 1] as any)?.time !==
                                  (messagesByDate[index] as any)?.time &&
                                sender(data?.from, users)?._id === user?._id
                                  ? "rounded-tr-2xl"
                                  : "rounded-tl-2xl"
                              }
                          `}
                              onMouseLeave={() => setDropShow(false)}
                            >
                              {verifyQRCodeImage(data?.content) ? (
                                <span className='flex flex-col gap-1 '>
                                  <a
                                    href={data?.content}
                                    target={"_blank"}
                                    className='text-blue-600 underline'
                                  >
                                    {data?.content}
                                    <img
                                      src={ChangeLinkToQRCode(data?.content)}
                                      alt='QR Code'
                                      className='w-[350px] h-[350px] hid'
                                    />
                                  </a>
                                </span>
                              ) : (
                                <span className='flex gap-2 items-center justify-center'>
                                  <span className=''>
                                    {filterMessage(data?.content)}
                                  </span>
                                  {(data?.from?._id === user?._id ||
                                    rooms
                                      .find(
                                        (currRoom: IRoomType) =>
                                          currRoom.roomCode === searchRoom
                                      )
                                      ?.users?.find(
                                        (currUser: any) =>
                                          currUser.role === ROLE.ADMIN
                                      )?.userId === user?._id) && (
                                    <span className='hidden group-hover:flex cursor-pointer relative '>
                                      <FontAwesomeIcon
                                        icon={faChevronDown}
                                        onClick={() => setDropShow(!dropShow)}
                                      />
                                      {dropShow && (
                                        <span
                                          className={`bg-secondary-500 z-50 rounded-md border absolute top-[calc(100%_+_10px)] w-20 h-20 p-1 py-2 ${
                                            data?.from?._id === user?._id &&
                                            "right-0"
                                          }`}
                                        >
                                          <button
                                            className='text-secondary-500 bg-primary-500 p-1 rounded-md
                                      '
                                            onClick={() =>
                                              deleteMessage(data?._id)
                                            }
                                          >
                                            DELETE
                                          </button>
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </span>
                              )}
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
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <form
        className={`h-[8%] w-full border-t px-3 flex xl:px-56 justify-between gap-2 bg-primary-500 ${
          user.role === ROLE.ADMIN && "hidden"
        }`}
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
