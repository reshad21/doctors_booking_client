import { baseApi } from "../baseApi";

const preManagementApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    getPreManagement: builder.query({
      query: () => {
        return {
            url: "/preManagement",
            method: "GET",
          }
      },
      providesTags: ["preManagement"],
    }),
    createPreManagement: builder.mutation({
      query: (data) => {
        return {
            url: `/preManagement`,
            method: "POST",
            body:data
          }
      },
      invalidatesTags:["preManagement"]
    }),
    deletePreManagement: builder.mutation({
      query: (id) => {
        return {
            url: `/preManagement/${id}`,
            method: "DELETE",
          }
      },
      invalidatesTags:["preManagement"]
    }),
   
  }),
});
export const {useGetPreManagementQuery,useCreatePreManagementMutation,useDeletePreManagementMutation} = preManagementApi;
