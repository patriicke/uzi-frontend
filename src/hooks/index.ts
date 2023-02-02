import { toast } from "react-toastify";
import { api } from "../api/api";
import { login } from "../redux/slices/userSlice";

export const useLogin = async (
  user: { email: string; password: string },
  setError: any,
  login: any,
  dispatch: any,
  setLoginPage: any,
  setLoading: any
) => {
  try {
    setLoading(true);
    const request = await api.post("/user/login", user);
    const response = request.data;
    dispatch(login({ ...response.user, token: response.token }));
    setLoginPage(false);
    localStorage.setItem("token", response.token);
    toast.success("Logged in successfully!");
  } catch (error: any) {
    setError(error.response.data.message);
  } finally {
    setLoading(false);
  }
};

//Signup hook

export const useSignup = async (
  user: {
    fullname: string;
    email: string;
    password: string;
    username: string;
    profileImage: any;
  },
  setError: any,
  dispatch: any,
  setLoginPage: any,
  setLoading: any
) => {
  try {
    setLoading(true);
    const request = await api.post("/user/create", {
      ...user,
      joined: new Date()
    });
    const response = await request.data;
    dispatch(login({ ...response.user, token: response.token }));
    console.log(response.token);
    setLoginPage(false);
    localStorage.setItem("token", response.token);
    toast.success("Account created successfully!");
  } catch (error: any) {
    setError(`${error.response.data.content}`);
    console.log(error);
  } finally {
    setLoading(false);
  }
};

// Get users

export const getUsers = async (
  token: string,
  setUsers: Function,
  dispatch: any,
  updateUsers: any
) => {
  try {
    const request = await api.get("/user/all", {
      headers: {
        authorization: token
      }
    });
    const response = request.data;
    setUsers(response.users);
    dispatch(updateUsers(response.users));
  } catch (error) {
    console.log(error);
  }
};

// Delete your account

export const deleteUser = async () => {
  try {
    const request = await api.delete("/user/delete");
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserByAdmin = async (
  token: string,
  userId: string,
  toast: any,
  setLoading: Function
) => {
  try {
    setLoading(true);
    await api.delete(`/user/delete/${userId}`, {
      headers: {
        authorization: token
      }
    });
    toast.success("User Deleted Successfully");
  } catch (error) {
    console.log(error);
    toast.error("User Deleted Successfully");
  } finally {
    setLoading(true);
  }
};

export const uploadImage = async (image: any) => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "chatpresetimages");
  try {
    let res = await fetch(
      "https://api.cloudinary.com/v1_1/dkpaiyjv5/image/upload",
      {
        method: "post",
        body: data
      }
    );
    const urlData = await res.json();
    return urlData.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${
    date.getDate().toString().length > 1 ? date.getDate() : "0" + date.getDate()
  }`;
};

export const sender = (userId: any, users: any) =>
  users.find((user: any) => user._id == userId._id);

export const formatUrl = (url: string) => {
  if (url) {
    let givenUrl = url?.split("upload");
    return `${givenUrl[0]}/upload/c_crop,g_face,h_700,w_700/r_max/c_scale,w_500/${givenUrl[1]}`;
  }
  return url;
};
