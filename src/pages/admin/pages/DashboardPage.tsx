import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import CardComponent from "../components/card/CardComponent";
import { AdminContext, IAdminContext } from "../context";
import { getDataBaseStatus } from "../hooks";

const DashboardPage: React.FC = () => {
  const { databaseStatus, setDatabaseStatus } =
    useContext<IAdminContext>(AdminContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDatabase = async () => {
    try {
      const data = await getDataBaseStatus();
      setDatabaseStatus(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);
  const CardComponents = [
    {
      data: {
        title: "Users",
        count: (databaseStatus as any)?.numberOfUsers
      },
      icon: faUser
    },
    {
      data: {
        title: "Rooms",
        count: (databaseStatus as any)?.numberOfRooms
      },
      icon: faUser
    },
    {
      data: {
        title: "Messages",
        count: (databaseStatus as any)?.numberOfMessages
      },
      icon: faUser
    }
  ];
  return (
    <div className='px-5'>
      <div>Welcome again to Admin Dashboard!</div>
      {isLoading ? (
        <div className='flex items-center justify-center py-2'>Waiting...</div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4 py-2'>
          {CardComponents.map(({ data, icon }, _index) => {
            return (
              <CardComponent
                key={_index}
                faIcon={icon}
                data={{ count: data.count, title: data.title }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
