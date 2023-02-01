import React from "react";
import ChatComponent from "../../components/Chat/ChatComponent";
import SideBar from "../../components/SideBar/SideBar";
const ChatInterface: React.FC = () => {
  return (
    <div className='h-screen w-screen overflow-x-hidden flex'>
      <SideBar />
      <ChatComponent />
    </div>
  );
};

export default ChatInterface;
