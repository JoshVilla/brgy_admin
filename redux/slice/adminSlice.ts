import { IAdmin } from "@/models/adminModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminInfoState {
  adminInfo: IAdmin | {};
}

const initialState: AdminInfoState = {
  adminInfo: {},
};

const adminInfoSlice = createSlice({
  name: "adminInfo",
  initialState,
  reducers: {
    setAdminInfo: (state, action: PayloadAction<IAdmin>) => {
      state.adminInfo = action.payload;
    },
    clearAdmin: (state) => {
      state.adminInfo = {};
    },
  },
});

export const { setAdminInfo, clearAdmin } = adminInfoSlice.actions;
export default adminInfoSlice.reducer;
