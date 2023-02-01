import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { resetRoom } from "../redux/slices/roomSlice";
import { logout, updateUserRedux } from "../redux/slices/userSlice";

export const useWhoAmI = (dispatch: Function) => {
  const whoAmI = async (): Promise<any> => {
    try {
      const response = await api.get("/user/whoami");
      const data = await response.data;
      dispatch(updateUserRedux({ ...data.user, token: data.access_token }));
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console.log(error);
    }
  };
  return { whoAmI };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = () => {
    try {
      dispatch(logout());
      dispatch(resetRoom());
      localStorage.removeItem("token");
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  return { logoutUser };
};
