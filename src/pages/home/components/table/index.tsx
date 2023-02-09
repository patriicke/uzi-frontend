import { ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export type TableColumn<Entry> = {
  title: string;
  selector?: string;
  cell: (row: Entry, index: number) => ReactNode;
};

type DataTableProps<Entry> = {
  columns: TableColumn<Entry>[];
  data: Entry[];
  isLoading?: boolean;
  handleEditAction?: (id: string) => void;
  handleDeleteAction?: (id: string) => void;
  setState?: Function;
  handleGetData?: (skip: number, limit: number) => void;
  total: number;
};

export const AdminTable = <Entry extends {}>(props: DataTableProps<Entry>) => {
  const {
    columns,
    data,
    isLoading = false,
    handleEditAction,
    handleDeleteAction,
    handleGetData,
    total
  } = props;

  const [paginate, setPaginate] = useState({
    skip: 0,
    limit: 10,
    pages: 1
  });

  useEffect(() => {
    if (handleGetData) {
      handleGetData(paginate.skip, paginate.limit);
    }
  }, [paginate]);

  function onClickFirstPage() {
    setPaginate((prev: any) => {
      return {
        ...prev,
        skip: 0
      };
    });
  }

  function onClickLastPage() {
    setPaginate((prev: any) => {
      return {
        ...prev,
        skip: total - prev.limit
      };
    });
  }

  function onLimitChange(e: any) {
    setPaginate((prev: any) => {
      return {
        ...prev,
        limit: Number(e.target.value)
      };
    });
  }

  function onClickNextPage() {
    if (paginate.limit + paginate.skip >= total) return onClickLastPage();
    setPaginate((prev: any) => {
      return {
        ...prev,
        skip: prev.skip + prev.limit
      };
    });
  }

  function onClickPreviousPage() {
    if (paginate.skip - paginate.limit <= 0) return onClickFirstPage();
    setPaginate((prev: any) => {
      return {
        ...prev,
        skip: prev.skip - prev.limit
      };
    });
  }

  return (
    <div className='px-2'>
      <div className='w-full overflow-x-auto'>
        <table className='w-full divide-y overflow-hidden whitespace-nowrap'>
          <thead className='w-full'>
            <tr className='bg-primary-500'>
              <th className='py-3 px-2 text-sm font-medium text-white border'>
                #
              </th>
              {columns.map((column, key) => (
                <th
                  key={key}
                  className='py-3 px-2 text-sm font-medium text-white border'
                >
                  {column.title}
                </th>
              ))}
              <th className='py-3 px-2 text-sm font-medium text-white border'>
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              {isLoading && (
                <td
                  colSpan={columns.length + 1}
                  className='py-3 px-2 text-center text-sm font-normal text-light'
                >
                  Loading ...
                </td>
              )}

              {!isLoading && data.length === 0 && (
                <td
                  colSpan={columns.length + 1}
                  className='py-3 px-2 text-center text-sm font-normal text-light'
                >
                  No entries found
                </td>
              )}
            </tr>

            {!isLoading &&
              data.map((element, elementKey) => (
                <tr
                  key={elementKey}
                  className='border hover:bg-dark-light text-gray-600'
                >
                  <td className='py-3 px-2 text-center text-sm font-normal text-light border'>
                    {paginate.skip + elementKey + 1}
                  </td>

                  {columns.map((column, columnKey) => (
                    <td
                      key={columnKey}
                      className='py-3 px-2 text-left text-sm font-normal text-light border'
                    >
                      {column.cell(element, elementKey)}
                    </td>
                  ))}

                  <td className='py-3 px-2 text-center text-sm font-normal text-light border'>
                    <span className='w-full flex items-center justify-center gap-3'>
                      <button
                        onClick={() => {
                          if (handleDeleteAction)
                            handleDeleteAction((element as any)._id);
                        }}
                      >
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
                      </button>
                      <button
                        onClick={() => {
                          if (handleEditAction)
                            handleEditAction((element as any)._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className='text-md' />
                      </button>
                      <Link to={`/chat/${(element as any)?.roomCode}`}>
                        <FontAwesomeIcon icon={faEye} className='text-md' />
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isLoading && (
        <div className='w-full flex items-center justify-between py-4 text-sm font-medium text-gray-600'>
          <div className='flex gap-2 items-center justify-between'>
            <span className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'>
              {!paginate.skip ? 0 : paginate.skip + 1} -{" "}
              {paginate.skip + data?.length} of {total}
            </span>
            <span>
              <label htmlFor='select'>Rows per page </label>
              <select
                id='select'
                className='p-1 outline-none bg-gray-200 text-gray-600 rounded-md'
                onChange={onLimitChange}
                value={paginate.limit}
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
              </select>{" "}
            </span>
          </div>

          <div className='flex gap-2 justify-end text-sm font-medium text-gray-600'>
            <button
              className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'
              onClick={onClickFirstPage}
            >
              First
            </button>
            <button
              className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'
              disabled={!paginate.skip}
              onClick={onClickPreviousPage}
            >
              Previous
            </button>
            <button
              className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'
              disabled={paginate.skip + paginate.limit >= total}
              onClick={onClickNextPage}
            >
              Next
            </button>
            <button
              className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer hover:bg-primary-500 hover:text-white'
              onClick={onClickLastPage}
              disabled={paginate.skip + paginate.limit === total}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
