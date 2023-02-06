import React from "react";
import ChatComponent from "../../components/chat/ChatComponent";
import SideBar from "../../components/sidebar/SideBar";
const ChatInterface: React.FC = () => {
  return (
    <div className='h-screen w-screen overflow-x-hidden flex'>
      <SideBar />
      <ChatComponent />
    </div>
  );
};

export default ChatInterface;
