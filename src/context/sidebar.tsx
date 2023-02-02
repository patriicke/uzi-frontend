import { useState, useMemo, createContext, FC, ReactNode } from "react";

export const SidebarContext = createContext<any>({});

export type ISideBarContext = {
  isSidebarOpen: boolean;
  toggleSidebar: Function;
  closeSidebar: Function;
};

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      closeSidebar
    }),
    [isSidebarOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
