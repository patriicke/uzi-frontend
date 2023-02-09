import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { DataTable, TableColumn } from "../../app/elements/datatable";
import { CommonContext } from "../../context";
import { ICommonContext } from "../../types/common.context";
import { format } from "../../utils";
import { IRoomType } from "../admin/pages/RoomsPage";
import { getRoomByAdminUser } from "./components/hooks/admin.hook";
import { AdminTable } from "./components/table";

const AdminUserHomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<IRoomType[]>([]);

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

  const handleGetRooms = async (skip: number, limit: number) => {
    try {
      const data = await getRoomByAdminUser(skip, limit);
      setRooms(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { setJoinRoomData } = useContext<ICommonContext>(CommonContext);
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const joinRoomLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (roomCode?.length > 10) return setError("Invalid room code");
      const request = await api.get(`/room/find?roomCode=${roomCode}`);
      const data = await request.data;
      navigate(`/room/join/${data.room.roomCode}`);
      setJoinRoomData(data.room);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full md:w-4/5 h-screen relative p-4'>
      <form className='flex gap-7 items-center py-4' onSubmit={joinRoomLink}>
        <div className='flex flex-col gap-1'>
          <div className='h-10 w-[20em] border border-slate-400 rounded-[2em] px-2 p-5 flex items-center'>
            <i className='fa-solid fa-circle-plus text-primary-500 text-2xl cursor-pointer'></i>
            <input
              type='text'
              className='w-[98%] outline-none border-none bg-inherit text-gray-800 text-center'
              placeholder='Please Enter Room Code to Join'
              onChange={(e) => {
                setRoomCode(e.target.value);
                setError("");
              }}
            />
          </div>
          {error && <div className='text-center text-red-500'>{error}</div>}
        </div>
        <div className='flex gap-3'>
          <button
            className='bg-primary-500 text-white py-2 px-10 rounded-[2em] disabled:bg-secondary-500 disabled:text-primary-500 shadow-md border'
            type='submit'
            disabled={!roomCode || loading}
          >
            {loading ? "Loading..." : "Join Now"}
          </button>
        </div>
      </form>
      <AdminTable
        columns={columns}
        isLoading={isLoading}
        data={rooms}
        total={rooms.length}
        handleGetData={handleGetRooms}
      />
    </div>
  );
};

export default AdminUserHomePage;
