import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { format } from "../../../utils";
import { getAllUsers } from "../hooks";

const UsersPage: React.FC = () => {
  const [users, setAllUsers] = useState();

  const getUsers = async () => {
    const data = await getAllUsers();
    setAllUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='p-2'>
      <table className='w-full overflow-x-scroll'>
        <thead className='w-full'>
          <tr>
            <th className='border py-3 font-medium text-sm text-gray-500'>#</th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              FULLNAME
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              EMAIL
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              USERNAME
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              ROLE
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              JOINED
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              ROOMS
            </th>
            <th className='border py-3 font-medium text-sm text-gray-500'>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className='w-full'>
          {(users as any)?.map((user: any, index: number) => (
            <tr key={user._id}>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center'>
                <span className='w-full flex items-center justify-center px-2'>
                  {index + 1}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center'>
                <span className='w-full flex items-center justify-center'>
                  {user.fullname}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center'>
                  {user.email}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center'>
                  {user.username}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center'>
                  {user.role}{" "}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center'>
                  {format.humanDate(user.joined)}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center'>
                  {user.rooms?.length}
                </span>
              </td>
              <td className='border py-3 font-medium text-sm text-gray-500 items-center px-2'>
                <span className='w-full flex items-center justify-center gap-3'>
                  <svg
                    aria-hidden='true'
                    focusable='false'
                    data-prefix='fas'
                    data-icon='trash'
                    className='svg-inline--fa fa-trash '
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 448 512'
                    width={14}
                  >
                    <path
                      fill='currentColor'
                      d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z'
                    ></path>
                  </svg>
                  <FontAwesomeIcon icon={faEdit} className='text-md' />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className='flex gap-2 py-3 justify-end'>
        <li className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'>
          First
        </li>
        <li className='p-2 px-4 rounded-md cursor-pointer bg-primary-500 text-white'>
          1
        </li>
        <li className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'>
          Previous
        </li>
        <li className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'>
          Next
        </li>
        <li className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'>
          Last
        </li>
      </ul>
    </div>
  );
};

export default UsersPage;
