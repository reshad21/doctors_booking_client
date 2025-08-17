/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const authCacheMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Clear cache when new admin/doctor logs in
    if (action.type === "admin/setAdminDecodeData") {
      store.dispatch(baseApi.util.resetApiState());
    }

    // Clear cache on logout
    if (action.type === "auth/clearUserToken") {
      store.dispatch(baseApi.util.resetApiState());
    }

    return result;
  };
