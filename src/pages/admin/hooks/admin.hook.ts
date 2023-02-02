import { api } from "../../../api/api";

export const getDataBaseStatus = async () => {
  try {
    const response = await api.get("/admin/status");
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users/all");
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getAllRooms = async () => {
  try {
    const response = await api.get("/admin/rooms/all");
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getAllMessages = async () => {
  try {
    const response = await api.get("/admin/messages/all");
    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
