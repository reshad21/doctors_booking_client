import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";

const CALLED_SERIALS_KEY = "calledSerials";
const ENDED_SERIALS_KEY = "endedSerials";

interface SerialState {
  currentSerial: string | null;
  calledSerials: string[];
  endedSerials: string[];
}

const loadFromLocalStorage = (): SerialState => {
  const called = localStorage.getItem(CALLED_SERIALS_KEY);
  const ended = localStorage.getItem(ENDED_SERIALS_KEY);
  return {
    currentSerial: null,
    calledSerials: called ? JSON.parse(called) : [],
    endedSerials: ended ? JSON.parse(ended) : [],
  };
};

const saveToLocalStorage = (state: SerialState) => {
  localStorage.setItem(CALLED_SERIALS_KEY, JSON.stringify(state.calledSerials));
  localStorage.setItem(ENDED_SERIALS_KEY, JSON.stringify(state.endedSerials));
};

const initialState: SerialState = loadFromLocalStorage();

const serialSlice = createSlice({
  name: "serial",
  initialState,
  reducers: {
    setCurrentSerial(state, action: PayloadAction<string>) {
      state.currentSerial = action.payload;
    },
    clearCurrentSerial(state) {
      state.currentSerial = null;
    },
    addSerial(state, action: PayloadAction<string>) {
      if (!state.calledSerials.includes(action.payload)) {
        state.calledSerials.push(action.payload);
        saveToLocalStorage(state);
      }
    },
    removeSerial(state, action: PayloadAction<string>) {
      state.calledSerials = state.calledSerials.filter(
        (id) => id !== action.payload
      );
      saveToLocalStorage(state);
    },
    toggleSerial(state, action: PayloadAction<string>) {
      if (state.calledSerials.includes(action.payload)) {
        state.calledSerials = state.calledSerials.filter(
          (id) => id !== action.payload
        );
      } else {
        state.calledSerials.push(action.payload);
      }
      saveToLocalStorage(state);
    },
    clearAllSerials(state) {
      state.calledSerials = [];
      saveToLocalStorage(state);
    },
    endSerial(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.calledSerials = state.calledSerials.filter((item) => item !== id);
      if (!state.endedSerials.includes(id)) {
        state.endedSerials.push(id);
      }
      saveToLocalStorage(state);
    },
    // new reducers to set state from other tabs
    setCalledSerials(state, action: PayloadAction<string[]>) {
      state.calledSerials = action.payload;
    },
    setEndedSerials(state, action: PayloadAction<string[]>) {
      state.endedSerials = action.payload;
    },
  },
});

export const {
  setCurrentSerial,
  clearCurrentSerial,
  addSerial,
  removeSerial,
  toggleSerial,
  clearAllSerials,
  endSerial,
  setCalledSerials,
  setEndedSerials,
} = serialSlice.actions;

export const serialReducer = serialSlice.reducer;
