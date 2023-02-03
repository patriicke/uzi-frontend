import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
import { getAllRooms } from "../hooks";

export type IRoomType = {
  _id: string;
  roomCode: string;
  roomName: string;
  createdAt: string;
  roomImage: string;
  users: [];
  access: string;
  emails: [];
};

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = React.useState<IRoomType[]>([]);

  const columns: TableColumn<IRoomType>[] = [
    {
      title: "ROOM NAME",
      cell: (room: IRoomType) => room.roomName
    },
    {
      title: "ROOM CODE",
      cell: (room: IRoomType) => room.roomName
    },
    {
      title: "ACCESSIBLITY",
      cell: (room: IRoomType) => room.roomName
    },

    {
      title: "ROOM USERS",
      cell: (room: IRoomType) => room.roomName
    },
    {
      title: "CREATED AT",
      cell: (room: IRoomType) => room.roomName
    }
  ];

  const getRooms = async () => {
    const data = await getAllRooms();
    setRooms(data);
  };

  useEffect(() => {
    getRooms();
  }, []);

  return <DataTable isLoading={false} data={rooms} columns={columns} />;
};

export default RoomsPage;
