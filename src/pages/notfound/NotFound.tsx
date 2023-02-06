import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col text-md gap-2'>
      <p className='text-red-500'>404 | Page Not Found</p>
      <Link to={"/"} className='underline underline-offset-2'>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
