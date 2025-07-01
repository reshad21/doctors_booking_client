import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminByToken: builder.query({
      query: () => {
        return {
          url: "/admin/me",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAdminByTokenQuery } = adminApi;
