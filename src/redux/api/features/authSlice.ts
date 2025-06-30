
import type { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string;
}

// Define the initial state
const initialState: UserState = {
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<Partial<UserState>>) => {
        console.log(action.payload);
        
      return { ...state, ...action.payload };
    },

    // Clear user info (reset to initial state)
    clearUserToken: () => initialState,
  },
});

export const { setUserToken, clearUserToken } = authSlice.actions;

export default authSlice.reducer;
export const useCurrentToken = (state: RootState & { auth: UserState }) => state.auth.token;
