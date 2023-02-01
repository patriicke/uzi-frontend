import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";

const userData: User = {
  _id: "",
  fullname: "",
  username: "",
  profileImage: "",
  email: "",
  status: "",
  token: ""
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData
  },
  reducers: {
    login: (state, { payload }) => {
      state.userData = { ...payload };
    },
    logout: (state) => {
      state.userData = {};
    },
    updateUserRedux: (state, { payload }) => {
      state.userData = { ...payload };
    }
  }
});

export const { login, logout, updateUserRedux } = userSlice.actions;

export default userSlice.reducer;
