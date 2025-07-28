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
    updateDoctor: builder.mutation({
      query: (payload) => {
        return {
            url: "/auth/update-doctor",
            method: "PATCH",
            body: payload,
          }
      },
    }),
  }),
});

export const { useGetAdminByTokenQuery, useUpdateDoctorMutation} = adminApi;
