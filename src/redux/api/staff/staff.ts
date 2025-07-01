import { baseApi } from "../baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: () => {
        return {
            url: "/staff/get-staff",
            method: "GET",
          }
      },
    }),
    deleteStaff: builder.mutation({
      query: (id) => {
        return {
            url: `/staff/${id}`,
            method: "DELETE",
          }
      },
    }),
   
  }),
});
export const {useGetStaffQuery,useDeleteStaffMutation} = staffApi;
