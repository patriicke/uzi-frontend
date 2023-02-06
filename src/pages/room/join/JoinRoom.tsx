import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import RoomNotFoundModal from "../../../components/modal/RoomNotFoundModal";
import { CommonContext } from "../../../context";
import { ICommonContext } from "../../../types/common.context";
import { IRoomType } from "../../admin/pages/RoomsPage";

const JoinRoom = () => {
  const { room } = useParams();

  const { rooms } = useSelector((state: any) => state.room);

  const [currentRoom, setCurrentRoom] = useState(room);

  const { setJoinRoomData, setJoinRoomShow } =
    useContext<ICommonContext>(CommonContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const checkRoomExistance = async () => {
    try {
      const request = await api.get(`/room/find?roomCode=${room}`);
      const data = await request.data;
      setJoinRoomData(data.room);
    } catch (e: any) {
      setError(e.response.data.message);
    }
  };

  const joinRoom = () => {
    const alreadyRoomMember = rooms.find(
      (room: IRoomType) => room.roomCode == currentRoom
    );

    if (alreadyRoomMember) {
      return navigate(`/chat/${room}`);
    }

    setJoinRoomShow(true);
  };

  useEffect(() => {
    checkRoomExistance();
    joinRoom();
  }, [room]);

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        Wait a moment...
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className='h-screen w-screen flex items-center justify-center flex-col gap-4'>
        <span>
          <span className='font-semibold'>#{room}</span> {error}
        </span>
        <Link
          to={"/"}
          className='bg-primary-500 text-secondary-500 py-2 px-4 rounded-md'
        >
          Go Home
        </Link>
      </div>
    );
  }

  return <div></div>;
};

export default JoinRoom;
