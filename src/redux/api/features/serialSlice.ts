import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SerialState {
  currentSerial: number;
}

const initialState: SerialState = {
  currentSerial:
    localStorage.getItem("currentSerial") !== null
      ? Number(localStorage.getItem("currentSerial"))
      : -1,
};

const serialSlice = createSlice({
  name: "serial",
  initialState,
  reducers: {
    setCurrentSerial(state, action: PayloadAction<number>) {
      state.currentSerial = action.payload;
      localStorage.setItem("currentSerial", String(action.payload));
    },
    nextSerial(state, action: PayloadAction<number>) {
      if (state.currentSerial < action.payload - 1) {
        state.currentSerial += 1;
        localStorage.setItem("currentSerial", String(state.currentSerial));
      }
    },
    prevSerial(state) {
      if (state.currentSerial > 0) {
        state.currentSerial -= 1;
        localStorage.setItem("currentSerial", String(state.currentSerial));
      }
    },
  },
});

export const { setCurrentSerial, nextSerial, prevSerial } = serialSlice.actions;
export const serialReducer = serialSlice.reducer;
