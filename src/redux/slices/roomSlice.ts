import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "user",
  initialState: {
    rooms: []
  },
  reducers: {
    setRoomsRedux: (state, { payload }: any) => {
      state.rooms = payload;
    },
    addRoom: (state: any, action: any) => {
      state.rooms = [...state.rooms, action.payload];
    },
    resetRoom: (state: any) => {
      state.rooms = [];
    }
  }
});

export const { setRoomsRedux, addRoom, resetRoom } = roomSlice.actions;

export default roomSlice.reducer;
