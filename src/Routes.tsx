import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout";
import { ROLE } from "./lib";
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
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <> Admin Dashboard </> },
        { path: "users", element: <> Admin Users </> },
        { path: "rooms", element: <> Admin Rooms </> },
        { path: "messages", element: <> Admin Messages </> }
      ]
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);
};

export default UserDefineRouter;
