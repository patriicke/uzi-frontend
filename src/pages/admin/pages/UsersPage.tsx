import React, { useContext, useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
import { AdminContext, IAdminContext } from "../context";
import { getAllUsers } from "../hooks";

export type IUserType = {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  profileImage: string;
  role: string;
  rooms: [];
  status: string;
  joined: string;
};

const UsersPage: React.FC = () => {
  const { users, setUsers, databaseStatus, setShowCreateUser } =
    useContext<IAdminContext>(AdminContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns: TableColumn<IUserType>[] = [
    {
      title: "FULLNAME",
      cell: (user) => user.fullname
    },
    {
      title: "EMAIL",
      cell: (user) => user.email
    },
    {
      title: "USERNAME",
      cell: (user) => user.username
    },
    {
      title: "ROLE",
      cell: (user) => user.role
    },
    {
      title: "STATUS",
      cell: (user) => user.status
    },
    {
      title: "JOINED",
      cell: (user) => format.humanDate(user.joined)
    },
    {
      title: "ROOMS",
      cell: (user) => user.rooms.length
    }
  ];

  return (
    <div>
      <div>
        <button
          type='button'
          className='bg-primary-500 text-white p-2 m-2 px-3 rounded-md font-medium'
          onClick={() => setShowCreateUser(true)}
        >
          ADD USER
        </button>
      </div>
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        total={databaseStatus.numberOfUsers}
      />
    </div>
  );
};

export default UsersPage;
