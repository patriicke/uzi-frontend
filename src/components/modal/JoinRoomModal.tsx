import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { ICONS } from "../../assets";
import { CommonContext } from "../../context";
import { setRoomsRedux } from "../../redux/slices/roomSlice";
import { login, updateUserRedux } from "../../redux/slices/userSlice";
import { ICommonContext } from "../../types/common.context";

const JoinRoomModal: React.FC = () => {
  const { joinRoomShow, setJoinRoomShow, joinRoomData, setJoinRoomData } =
    useContext<ICommonContext>(CommonContext);

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector((state: any) => state.user);

  const joinRoomForFirstTime = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/room/join?roomCode=${joinRoomData?.roomCode}`
      );
      const data = await response.data;
      dispatch(setRoomsRedux(data.rooms));
      dispatch(updateUserRedux({ ...userData, ...data.user }));
      navigate(`/chat/${joinRoomData?.roomCode}`);
      setJoinRoomShow(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!username) {
        setError("Enter your username please!");
        return;
      }
      const response = await api.post("/user/public/create", {
        username
      });
      const data = response.data;
      dispatch(login({ ...data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      window.location.reload();
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelJoiningRoom = () => {
    setJoinRoomShow(false);
    navigate("/");
  };

  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex flex-col gap-5 items-center justify-center z-50 ${
        joinRoomShow ? "translate-x-0" : "-translate-x-full"
      } duration-200 ease-in-out`}
    >
      {!userData?.token ? (
        <form
          onSubmit={handleSubmit}
          className={"p-8 border shadow-lg bg-white rounded-md"}
        >
          <p
            tabIndex={0}
            role='heading'
            aria-label='Create room'
            className='text-xl font-semibold leading-6 text-gray-800'
          >
            Provide a username to use in this room!
          </p>
          <div className='flex gap-3 py-3'>
            <span>
              <img src={ICONS.RoomIcon} alt='' className='w-12' />
            </span>
            <span className='flex flex-col font-semibold'>
              <span>{joinRoomData?.roomName}</span>
              <span>#{joinRoomData?.roomCode}</span>
            </span>
          </div>
          <div className='pt-2'>
            <label className='text-sm font-medium leading-none text-gray-800'>
              Username
            </label>
            <input
              role='input'
              type='text'
              className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
              placeholder='Username'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
                setError("");
              }}
              value={username}
            />
          </div>
          {error && <div className='pt-2 text-red-500'>{error}</div>}
          <div className='mt-8 flex gap-2'>
            <div
              className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600 flex items-center justify-center cursor-pointer'
              onClick={cancelJoiningRoom}
            >
              CANCEL
            </div>
            <button
              className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600'
              type='submit'
              disabled={loading}
            >
              {loading ? "LOADING..." : "JOIN"}
            </button>
          </div>
        </form>
      ) : (
        <div className='w-100 flex flex-col gap-5 font-medium'>
          <div>Are you sure you want to join this room?</div>
          <div className='flex gap-3 justify-center'>
            <span>
              <img src={ICONS.RoomIcon} alt='' className='w-12' />
            </span>
            <span className='flex flex-col font-semibold'>
              <span>{joinRoomData?.roomName}</span>
              <span>#{joinRoomData?.roomCode}</span>
            </span>
          </div>
          <div className='flex justify-between gap-4 '>
            <button
              className='bg-primary-500 text-white w-1/2 p-3 rounded-sm'
              onClick={cancelJoiningRoom}
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              className='bg-primary-500 text-white w-1/2 p-3 rounded-sm'
              onClick={joinRoomForFirstTime}
              disabled={loading}
            >
              {loading ? "Loading..." : "JOIN"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRoomModal;
