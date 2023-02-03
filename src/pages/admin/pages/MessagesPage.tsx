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
    // <div className='p-2'>
    //   <table className='w-full overflow-x-scroll'>
    //     <thead className='w-full'>
    //       <tr>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>#</th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           MESSAGE CONTENT
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           RECEIVER ROOM CODE
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           SENDER EMAIL
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           SENDER ROLE
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           SENT DATE
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           SENT TIME
    //         </th>
    //         <th className='border py-3 font-medium text-sm text-gray-500'>
    //           ACTIONS
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody className='w-full'>
    //       {(messages as any)?.map((message: any, index: number) => (
    //         <tr key={message._id}>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center'>
    //             <span className='w-full flex items-center justify-center px-2'>
    //               {index + 1}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center'>
    //             <span className='w-full flex items-center justify-center'>
    //               {message.content}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center'>
    //               {message.to}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center'>
    //               {message.from?.email}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center'>
    //               {message.from?.role}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center'>
    //               {format.humanDate(message.createdAt)}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center'>
    //               {message.time}
    //             </span>
    //           </td>
    //           <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
    //             <span className='w-full flex items-center justify-center gap-3'>
    //               <svg
    //                 aria-hidden='true'
    //                 focusable='false'
    //                 data-prefix='fas'
    //                 data-icon='trash'
    //                 className='svg-inline--fa fa-trash cursor-pointer hover:text-primary-500'
    //                 role='img'
    //                 xmlns='http://www.w3.org/2000/svg'
    //                 viewBox='0 0 448 512'
    //                 width={14}
    //                 onClick={() => deleteMessage(message._id, setMessages)}
    //               >
    //                 <path
    //                   fill='currentColor'
    //                   d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z'
    //                 ></path>
    //               </svg>
    //               <FontAwesomeIcon icon={faEdit} className='text-md' />
    //             </span>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   <div className='flex items-center justify-between'>
    //     <ul>
    //       <li className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white font-medium text-sm'>
    //         0 - 10 of 100 messages
    //       </li>
    //     </ul>
    //     <ul className='flex gap-2 py-3'>
    //       <li
    //         className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white text-sm font-medium'
    //         onClick={onClickFirstPage}
    //       >
    //         First
    //       </li>
    //       <li
    //         className='p-2 px-4 rounded-md cursor-pointer bg-primary-500 text-white'
    //         onClick={() => onClickPage(1)}
    //       >
    //         1
    //       </li>
    //       <li
    //         className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white text-sm font-medium'
    //         onClick={onClickPreviousPage}
    //       >
    //         Previous
    //       </li>
    //       <li
    //         className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white text-sm font-medium'
    //         onClick={onClickNextPage}
    //       >
    //         Next
    //       </li>
    //       <li
    //         className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white text-sm font-medium'
    //         onClick={onClickLastPage}
    //       >
    //         Last
    //       </li>
    //     </ul>
    //   </div>
    // </div>
    <DataTable data={messages} columns={columns} isLoading={false} />
  );
};

export default MessagesPage;
