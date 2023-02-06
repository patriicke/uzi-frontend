import AuthComponent from "../auth/AuthComponent";
import CreatePublicUserModal from "./CreatePublicUserModal";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomAlertModal from "./JoinRoomModal";
import LeaveRoomAlertModal from "./LeaveRoomModal";
import RoomNotFoundModal from "./RoomNotFoundModal";
import ToastModal from "./ToastModal";

const Modal = () => {
  return (
    <>
      <CreatePublicUserModal />
      <CreateRoomModal />
      <JoinRoomAlertModal />
      <LeaveRoomAlertModal />
      <RoomNotFoundModal />
      <ToastModal />
      <AuthComponent />
    </>
  );
};
export default Modal;
