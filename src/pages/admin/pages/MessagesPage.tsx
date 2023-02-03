import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { DataTable, TableColumn } from "../../../app/elements/datatable";
import { format } from "../../../utils";
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
  const [messages, setMessages] = useState<IMessageType[]>([]);
  const [currentSkip, setCurentSkip] = useState(0);

  const getMessages = async () => {
    const data = await getAllMessages();
    setMessages(data);
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

  function onClickFirstPage() {
    setCurentSkip(0);
  }

  function onClickPreviousPage() {
    if (currentSkip == 0) return;
    setCurentSkip(currentSkip - 10);
  }

  function onClickPage(page: number) {
    setCurentSkip(page);
  }

  function onClickNextPage() {
    if (currentSkip == 100) return;
    setCurentSkip(currentSkip + 10);
  }
  function onClickLastPage() {
    setCurentSkip(90);
  }

  return (
    <DataTable
      data={messages}
      columns={columns}
      isLoading={false}
      setMessages={setMessages}
    />
  );
};

export default MessagesPage;
