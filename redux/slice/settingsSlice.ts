import { IGeneralSettings } from "@/models/settingsModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsInfoState {
  settingsInfo: IGeneralSettings | {};
}

const initialState: SettingsInfoState = {
  settingsInfo: {},
};

const settingsInfoSlice = createSlice({
  name: "settingsInfo",
  initialState,
  reducers: {
    setSettingsInfo: (state, action: PayloadAction<IGeneralSettings>) => {
      state.settingsInfo = action.payload;
    },
    clearSettings: (state) => {
      state.settingsInfo = {};
    },
  },
});

export const { setSettingsInfo, clearSettings } = settingsInfoSlice.actions;
export default settingsInfoSlice.reducer;
