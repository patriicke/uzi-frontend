import React from "react";
import MobileSideBarComponent from "./MobileNavBar";
import SideBarComponent from "./SideBarComponent";

const Sidebar: React.FC = () => {
  return (
    <>
      <SideBarComponent />
      <MobileSideBarComponent />
    </>
  );
};

export default Sidebar;
