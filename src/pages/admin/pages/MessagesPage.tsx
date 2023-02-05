import React, { useContext, useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
import { AdminContext, IAdminContext } from "../context";
import { deleteMessage, getAllMessages } from "../hooks";

export type IMessageType = {
  content: string;
  from: {
    email: string;
    role: string;
  };
  socketId: string;
  time: string;
  date: string;
  to: string;
  role: string;
};

const MessagesPage: React.FC = () => {
  const { messages, setMessages, databaseStatus } =
    useContext<IAdminContext>(AdminContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGetMessages = async (skip: number, limit: number) => {
    try {
      const data = await getAllMessages(skip, limit);
      setMessages(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await deleteMessage(id, setMessages);
    } catch (error) {}
  };

  const columns: TableColumn<IMessageType>[] = [
    {
      title: "MESSAGE CONTENT",
      cell: (message) => message.content
    },
    {
      title: "RECIEVER ROOM CODE",
      cell: (message) => message.to
    },
    {
      title: "SENDER EMAIL",
      cell: (message) => message.from.email
    },
    {
      title: "SENDER ROLE",
      cell: (message) => message.from.role
    },
    {
      title: "SENT DATE",
      cell: (message) => format.humanDate(message.date)
    },
    {
      title: "MESSAGE TIME",
      cell: (message) => format.formatTime(message.time)
    }
  ];

  return (
    <DataTable
      data={messages}
      columns={columns}
      isLoading={isLoading}
      handleDeleteAction={handleDeleteAction}
      handleGetData={handleGetMessages}
      total={databaseStatus.numberOfMessages}
    />
  );
};

export default MessagesPage;
