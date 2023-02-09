import { api } from "../../../../api/api";

export const getRoomByAdminUser = async (skip: number, limit: number) => {
  try {
    const response = await api.get(`/room/admin/?skip=${skip}&limit=${limit}`);
    return response.data.rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
};
