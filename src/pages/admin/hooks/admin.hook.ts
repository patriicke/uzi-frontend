import { toast } from "react-toastify";
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

export const getAllMessages = async (skip: number, limit: number) => {
  try {
    const response = await api.get(
      `/admin/messages/all?skip=${skip}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const deleteMessage = async (
  messageId: string,
  setMessages: Function
) => {
  try {
    const response = await api.delete(`/admin/message/${messageId}`);
    setMessages((messages: any) => {
      return messages.filter((message: any) => message._id != messageId);
    });
    toast.success("Message deleted successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete message");
    console.log(error);
    return null;
  }
};

export const createUserAdmin = async (data: any) => {
  try {
    const request = await api.post(`/admin`);
    const data = await request.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
