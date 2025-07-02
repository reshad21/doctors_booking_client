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
      providesTags: ["staff"],
    }),
    createStaff: builder.mutation({
      query: (data) => {
        return {
            url: `/staff/create-staff`,
            method: "POST",
            body:data
          }
      },
      invalidatesTags:["staff"]
    }),
    deleteStaff: builder.mutation({
      query: (id) => {
        return {
            url: `/staff/${id}`,
            method: "DELETE",
          }
      },
      invalidatesTags:["staff"]
    }),
   
  }),
});
export const {useGetStaffQuery,useDeleteStaffMutation,useCreateStaffMutation} = staffApi;
