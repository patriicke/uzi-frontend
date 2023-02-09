import React, { useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../../app/elements/datatable";
import { format } from "../../../../utils";
import { IRoomType } from "../../../admin/pages/RoomsPage";

const AdminUserComponent = () => {
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

  //   const getRooms = async () => {
  //     try {
  //       const data = await getAllRooms();
  //       setRooms(data);
  //     } catch (error) {
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  useEffect(() => {
    // getRooms();
  }, []);

  return (
    <div>
      <DataTable columns={columns} isLoading={isLoading} data={[]} total={0} />
    </div>
  );
};

export default AdminUserComponent;
