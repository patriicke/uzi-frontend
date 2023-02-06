import React from "react";
import { ToastContainer } from "react-toastify";

const ToastModal: React.FC = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='colored'
    />
  );
};

export default ToastModal;
