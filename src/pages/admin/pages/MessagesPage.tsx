import React, { useContext, useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { AdminContext, IAdminContext } from "../context";
import { deleteMessage, getAllMessages } from "../hooks";

export type IMessageType = {
  content: string;
  from: {
    email: string;
  };
  socketId: string;
  time: string;
  date: string;
  to: string;
  role: string;
};

const MessagesPage: React.FC = () => {
  const { messages, setMessages } = useContext<IAdminContext>(AdminContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getMessages = async () => {
    try {
      const data = await getAllMessages();
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

  useEffect(() => {
    getMessages();
  }, []);

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
      cell: (message) => message.role
    },
    {
      title: "SENT DATE",
      cell: (message) => message.date
    },
    {
      title: "MESSAGE TIME",
      cell: (message) => message.time
    }
  ];

  return (
    <DataTable
      data={messages}
      columns={columns}
      isLoading={isLoading}
      handleDeleteAction={handleDeleteAction}
    />
  );
};

export default MessagesPage;
