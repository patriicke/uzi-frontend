import React, { useContext, useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
import { AdminContext, IAdminContext } from "../context";
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
  const { rooms, setRooms } = useContext<IAdminContext>(AdminContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const columns: TableColumn<IRoomType>[] = [
    {
      title: "ROOM NAME",
      cell: (room: IRoomType) => room.roomName
    },
    {
      title: "ROOM CODE",
      cell: (room: IRoomType) => room.roomCode
    },
    {
      title: "ACCESSIBLITY",
      cell: (room: IRoomType) => room.access
    },

    {
      title: "ROOM USERS",
      cell: (room: IRoomType) => room.users.length
    },
    {
      title: "CREATED AT",
      cell: (room: IRoomType) => format.humanDate(room.createdAt)
    }
  ];

  const getRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return <DataTable isLoading={isLoading} data={rooms} columns={columns} />;
};

export default RoomsPage;
