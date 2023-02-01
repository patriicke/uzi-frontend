import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import SideBar from "../../components/SideBar/SideBar";
import { CommonContext } from "../../context";
import { setRoomsRedux } from "../../redux/slices/roomSlice";
import { updateUserRedux } from "../../redux/slices/userSlice";
import { ICommonContext } from "../../types/common.context";
import { User } from "../../types/user";

const HomePage: React.FC = () => {
  const { setLoginPage, loginPage, setShowSideBar, setCreatePublicUserShow } =
    useContext<ICommonContext>(CommonContext);
  const userData: User = useSelector((state: any) => state.user.userData);
  const navigate = useNavigate();
  const [enteredRoomCode, setEnteredRoomCode] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.token) return setCreatePublicUserShow(true);

    joinRoomForFirstTime(enteredRoomCode);
  };

  const joinRoomForFirstTime = async (roomCode: string) => {
    try {
      setLoading(true);
      const response = await api.post("/room/join", { roomCode });
      const data = await response.data;
      dispatch(setRoomsRedux(data.rooms));
      dispatch(updateUserRedux({ ...userData, ...data.user }));
      navigate(`/chat/${roomCode}`);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen overflow-x-hidden flex relative'>
      <SideBar />
      <div className='w-full md:w-4/5 h-screen flex items-center justify-center relative'>
        <div className='w-full px-4 flex justify-between gap-3 absolute top-2'>
          <div
            className='cursor-pointer z-50 md:hidden'
            onClick={() => setShowSideBar(true)}
          >
            <i className='fa-solid fa-bars text-2xl'></i>
          </div>
          {!loginPage && !userData.token && (
            <div className='w-full items-center justify-center flex gap-2 text-center flex-wrap'>
              <p className='text-red-500'>It seems you're not logged in</p>
              <p
                className='text-primary-500 underline cursor-pointer'
                onClick={() => setLoginPage(true)}
              >
                Login here
              </p>
            </div>
          )}
        </div>
        <form className='flex flex-col gap-7 items-center' onSubmit={joinRoom}>
          <h1 className='text-3xl font-semibold text-center px-2'>
            You don't have any Room please Join
          </h1>
          <div className='flex flex-col gap-1'>
            <div className='h-10 w-[20em] border border-slate-400 rounded-[2em] px-2 p-5 flex items-center'>
              <i className='fa-solid fa-circle-plus text-primary-500 text-2xl cursor-pointer'></i>
              <input
                type='text'
                className='w-[98%] outline-none border-none bg-inherit text-gray-800 text-center'
                placeholder='Please Enter Room Code to Join'
                onChange={(e) => {
                  setEnteredRoomCode(e.target.value);
                  setError("");
                }}
              />
            </div>
            {error && <div className='text-center text-red-500'>{error}</div>}
          </div>
          <div className='flex gap-3'>
            <div
              className='bg-primary-500 text-white py-2 px-8 rounded-[2em] cursor-pointer'
              onClick={() => {
                if (loading) return;
                if (!userData.token) setLoginPage(true);
                else navigate("/select");
              }}
            >
              {loading ? "Loading..." : "Go to select"}
            </div>
            <button
              className='bg-primary-500 text-white py-2 px-10 rounded-[2em] disabled:bg-gray-500'
              type='submit'
              disabled={!enteredRoomCode || loading}
            >
              {loading ? "Loading..." : "Join Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
