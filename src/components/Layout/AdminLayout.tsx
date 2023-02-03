import { Outlet } from "react-router-dom";
import "./../../style/admin.css";
import Sidebar from "../../pages/admin/components/sidebar";
import { SidebarProvider } from "../../context/sidebar";
import AdminNavBar from "../../pages/admin/components/navbar/AdminNavBar";
import {
  AdminContext,
  AdminProvider,
  IAdminContext
} from "../../pages/admin/context";
import { getDataBaseStatus } from "../../pages/admin/hooks";
import { useContext, useEffect } from "react";

const AdminLayout = () => {
  const { setDatabaseStatus } = useContext<IAdminContext>(AdminContext);
  const getDatabase = async () => {
    const data = await getDataBaseStatus();
    setDatabaseStatus(data);
  };

  useEffect(() => {
    getDatabase();
  }, []);
  return (
    <AdminProvider>
      <SidebarProvider>
        <section className='e qa cb db cc ad'>
          <Sidebar />
          <div className='c f g t sa db dd pd xg vb' />
          <div className='db bh'>
            <AdminNavBar />
            <section className='bg-white py-5 lg:py-9 px-3 overflow-x-hidden'>
              <Outlet />
            </section>
          </div>
        </section>
      </SidebarProvider>
    </AdminProvider>
  );
};
export default AdminLayout;
