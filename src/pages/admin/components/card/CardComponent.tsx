import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CardComponent: React.FC<{
  data: {
    title: string;
    count: number;
  };
  faIcon: IconDefinition;
  className?: string;
}> = ({ faIcon, data, className }) => {
  return (
    <div
      className={`flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 border ${className}`}
    >
      <div className='px-3 py-2 mr-4 rounded-full border'>
        <FontAwesomeIcon icon={faIcon} className={"text-xl"} />
      </div>
      <div>
        <p className='mb-2 text-sm font-medium text-gray-600 dark:text-gray-400'>
          All {data.title}
        </p>
        <p className='text-md font-semibold text-gray-700 dark:text-gray-200'>
          Total {data.title}{" "}
          {data.count &&
            new Intl.NumberFormat("en-us").format(data.count).toString()}
        </p>
      </div>
    </div>
  );
};

export default CardComponent;
