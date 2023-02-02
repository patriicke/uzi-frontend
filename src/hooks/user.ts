import { useDispatch } from "react-redux";
import { api } from "../api/api";
import { resetRoom } from "../redux/slices/roomSlice";
import { logout, updateUserRedux } from "../redux/slices/userSlice";

export const useWhoAmI = () => {
  const dispatch = useDispatch();
  const { logoutUser } = useLogout();
  const whoAmI = async (): Promise<any> => {
    try {
      const response = await api.get("/user/whoami");
      const data = await response.data;
      dispatch(updateUserRedux({ ...data.user, token: data.access_token }));
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      logoutUser();
      console.log(error);
    }
  };
  return { whoAmI };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const logoutUser = () => {
    try {
      if (localStorage.getItem("token")) {
        dispatch(logout());
        dispatch(resetRoom());
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { logoutUser };
};
