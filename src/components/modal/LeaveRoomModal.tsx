import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { ICONS } from "../../assets";
import { CommonContext } from "../../context";
import { IRoomType } from "../../pages/admin/pages/RoomsPage";
import { setRoomsRedux } from "../../redux/slices/roomSlice";
import { updateUserRedux } from "../../redux/slices/userSlice";
import { ICommonContext } from "../../types/common.context";

const LeaveRoomModal: React.FC = () => {
  const { leaveRoomShow, setLeaveRoomShow, leaveRoomData } =
    useContext<ICommonContext>(CommonContext);

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector((state: any) => state.user);

  const joinRoomForFirstTime = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/room/leave?roomCode=${leaveRoomData?.roomCode}`
      );
      const data = await response.data;
      dispatch(
        setRoomsRedux(
          data.rooms.filter(
            (room: IRoomType) => room.roomCode !== leaveRoomData?.roomCode
          )
        )
      );
      dispatch(
        updateUserRedux({
          ...userData,
          rooms: userData.rooms.filter(
            (room: IRoomType) => room.roomCode !== leaveRoomData?.roomCode
          )
        })
      );
      navigate(`/`);
      setLeaveRoomShow(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelJoiningRoom = () => {
    setLeaveRoomShow(false);
  };

  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex flex-col gap-5 items-center justify-center z-50 ${
        leaveRoomShow ? "translate-x-0" : "-translate-x-full"
      } duration-200 ease-in-out`}
    >
      <div className='w-100 flex flex-col gap-5 font-medium'>
        <div>Are you sure you want to leave this room?</div>
        <div className='flex gap-3 justify-center'>
          <span>
            <img src={ICONS.RoomIcon} alt='' className='w-12' />
          </span>
          <span className='flex flex-col font-semibold'>
            <span>{leaveRoomData?.roomName}</span>
            <span>#{leaveRoomData?.roomCode}</span>
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
            {loading ? "Loading..." : "LEAVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRoomModal;
