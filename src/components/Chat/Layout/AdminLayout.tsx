import { Outlet } from "react-router-dom";
import "./../../style/admin.css";
import Sidebar from "../../../pages/admin/components/sidebar";
import { SidebarProvider } from "../../../context/sidebar";
import AdminNavBar from "../../../pages/admin/components/navbar/AdminNavBar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <section className='e qa cb db cc ad'>
        <Sidebar />
        <div className='c f g t sa db dd pd xg vb' />
        <div className='db bh'>
          <AdminNavBar />
          <section className='bg-white py-20 lg:py-9 px-3 overflow-x-hidden'>
            <Outlet />
          </section>
        </div>
      </section>
    </SidebarProvider>
  );
};
export default AdminLayout;