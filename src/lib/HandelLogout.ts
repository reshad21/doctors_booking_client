/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearAdminDecodeData } from "@/redux/api/features/adminSlice";
import { clearUserToken } from "@/redux/api/features/authSlice";
import { clearAllSerials } from "@/redux/api/features/serialSlice";
export const HandelLogout = (
  navigate: (path: string) => void,
  dispatch: any
) => {
  dispatch(clearUserToken());
  dispatch(clearAdminDecodeData());
  dispatch(clearAllSerials());
  navigate("/login");
};
