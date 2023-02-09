import { useSelector } from "react-redux";
import SideBar from "../../components/sidebar/SideBar";
import { ROLE } from "../../lib";
import { IUserType } from "../admin/pages/UsersPage";
import AdminUserHomePage from "./AdminUserPage";
import PublicUserHome from "./HomePage";

const HomePage = () => {
  const { userData } = useSelector((state: any) => state.user);
  return (
    <div className='h-screen w-screen overflow-x-hidden flex relative'>
      <SideBar />
      {(userData as IUserType).role === ROLE.ADMIN ? (
        <AdminUserHomePage />
      ) : (
        <PublicUserHome />
      )}
    </div>
  );
};

export default HomePage;
