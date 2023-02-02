import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout";
import { ROLE } from "./lib";
import DashboardPage from "./pages/admin/pages/DashboardPage";
import MessagesPage from "./pages/admin/pages/MessagesPage";
import RoomsPage from "./pages/admin/pages/RoomsPage";
import UsersPage from "./pages/admin/pages/UsersPage";
import ChatInterface from "./pages/Chat/ChatInterface";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import SelectRoom from "./pages/Select/SelectRoom";

const UserDefineRouter = () => {
  const { userData } = useSelector((state: any) => state.user);

  return useRoutes([
    {
      path: "/",
      element:
        userData.role === ROLE.SUPERADMIN ? (
          <Navigate to={"/admin"} />
        ) : (
          <HomePage />
        )
    },
    {
      path: "/select",
      element:
        userData.role === ROLE.SUPERADMIN ? (
          <Navigate to='/admin' />
        ) : userData.token ? (
          <SelectRoom />
        ) : (
          <Navigate to={"/"} />
        )
    },
    {
      path: "/chat/:room",
      element:
        userData.role === ROLE.SUPERADMIN ? (
          <Navigate to='/admin' />
        ) : userData.token ? (
          <ChatInterface />
        ) : (
          <Navigate to={"/"} />
        )
    },
    {
      path: "/admin",
      element:
        userData.token && userData.role === ROLE.SUPERADMIN ? (
          <AdminLayout />
        ) : (
          <Navigate to={"/"} />
        ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "users", element: <UsersPage /> },
        { path: "rooms", element: <RoomsPage /> },
        { path: "messages", element: <MessagesPage /> }
      ]
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);
};

export default UserDefineRouter;
