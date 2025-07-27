import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SerialState {
  currentSerial: number;
}

const initialState: SerialState = {
  currentSerial: -1,
};

const serialSlice = createSlice({
  name: "serial",
  initialState,
  reducers: {
    setCurrentSerial(state, action: PayloadAction<number>) {
      state.currentSerial = action.payload;
    },
    nextSerial(state, action: PayloadAction<number>) {
      if (state.currentSerial < action.payload - 1) {
        state.currentSerial += 1;
      }
    },
    prevSerial(state) {
      if (state.currentSerial > 0) {
        state.currentSerial -= 1;
      }
    },
  },
});

export const { setCurrentSerial, nextSerial, prevSerial } = serialSlice.actions;
export const serialReducer = serialSlice.reducer;
