import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (payload) => {
        return {
            url: "/auth/login",
            method: "POST",
            body: payload,
          }
      },
    }),
    loginStaff: builder.mutation({
      query: (payload) => {
        return {
            url: "/staff/staff-login",
            method: "POST",
            body: payload,
          }
      },
    }),
    updateAdminPass: builder.mutation({
      query: (payload) => {
        return {
            url: "/admin/admin-password",
            method: "PATCH",
            body: payload,
          }
      },
    }),
   
  }),
});
export const {useLoginAdminMutation,useLoginStaffMutation,useUpdateAdminPassMutation} = authApi;
