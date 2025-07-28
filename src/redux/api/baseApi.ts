/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    credentials: "include",
    prepareHeaders: (
      headers: Headers,
      { getState }: Pick<BaseQueryApi, "getState">
    ) => {
      const state = getState() as RootState;
      const token: string | undefined = (state.auth as any)?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  
  

  tagTypes: [
    "staff",
    "patient",
    "chamber",
    "watchVideo",
    "prescription",
    "preManagement",
    "message",
    "visit",
    "patient-summary"
  ],
  endpoints: () => ({}),
});
