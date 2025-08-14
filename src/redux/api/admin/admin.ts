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
      providesTags: ["admin"],
    }),
    updateDoctor: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/update-doctor",
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useGetAdminByTokenQuery, useUpdateDoctorMutation } = adminApi;
