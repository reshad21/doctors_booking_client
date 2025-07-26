/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PermissionItem {
  id: string;
  path: string;
  name: string;
  doctorId: string | null;
  organizationId: string | null;
  allowed: boolean;
  createdAt: string;
  updatedAt: string;
  staffId: string | null;
}

interface PermissionState {
  permissions: PermissionItem[];
}

const initialState: PermissionState = {
  permissions: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<PermissionItem[]>) => {
      state.permissions = action.payload;
    },
    addPermission: (state, action: PayloadAction<PermissionItem>) => {
      state.permissions.push(action.payload);
    },
    updatePermission: (state, action: PayloadAction<PermissionItem>) => {
      const index = state.permissions.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.permissions[index] = action.payload;
      }
    },
    removePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});

export const {
  setPermissions,
  addPermission,
  updatePermission,
  removePermission,
} = permissionSlice.actions;

export const permissionReducer = permissionSlice.reducer;
export const useRouteAccess = (path: string) => (state: any) =>
  state.permission.permissions.find((r: any) => r.path === path)?.allowed ?? false;
