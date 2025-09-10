// src/redux/slices/chamberSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChamberState {
  selectedByPage: {
    [page: string]: string | null;
  };
}

const initialState: ChamberState = {
  selectedByPage: {},
};

const chamberSlice = createSlice({
  name: "chamber",
  initialState,
  reducers: {
    setChamber: (
      state,
      action: PayloadAction<{ page: string; chamberId: string | null }>
    ) => {
      state.selectedByPage[action.payload.page] = action.payload.chamberId;
    },
    clearChamber: (state, action: PayloadAction<{ page: string }>) => {
      state.selectedByPage[action.payload.page] = null;
    },
  },
});

export const { setChamber, clearChamber } = chamberSlice.actions;
export const chamberReducer = chamberSlice.reducer;
