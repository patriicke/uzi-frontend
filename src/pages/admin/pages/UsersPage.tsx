import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
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
  const [users, setAllUsers] = useState<IUserType[]>([]);

  const getUsers = async () => {
    const data = await getAllUsers();
    setAllUsers(data);
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
      title: "JOINED",
      cell: (user) => user.joined
    },
    {
      title: "ROOMS",
      cell: (user) => user.rooms.length
    }
  ];

  return <DataTable columns={columns} data={users} isLoading={false} />;
};

export default UsersPage;
