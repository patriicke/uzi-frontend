import { api } from "../../../api/api";

export const getDataBaseStatus = async () => {
  try {
    const response = await api.get("/admin/status");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
