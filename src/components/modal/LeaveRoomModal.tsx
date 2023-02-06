import React, { useContext } from "react";
import { CommonContext } from "../../context";
import { ICommonContext } from "../../types/common.context";

const LeaveRoomModal: React.FC = () => {
  const { leaveRoomShow, setLeaveRoomShow } =
    useContext<ICommonContext>(CommonContext);

  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${
        leaveRoomShow ? "translate-x-0" : "-translate-x-full"
      } duration-200 ease-in-out`}
    ></div>
  );
};

export default LeaveRoomModal;
