import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  status: string;
  profilePhoto: string;
  type: string;
  iat: number;
  exp: number;
}

const initialState: DecodedToken = {
  id: "",
  email: "",
  name: "",
  status: "",
  profilePhoto: "",
  type: "",
  iat: 0,
  exp: 0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminDecodeData: (_state, action: PayloadAction<DecodedToken>) => {
      console.log(action.payload, "Admin decoded token");
      return action.payload;
    },

    clearAdminDecodeData: () => {
      return initialState;
    },
  },
});

export const { setAdminDecodeData, clearAdminDecodeData } = adminSlice.actions;
export default adminSlice.reducer;
