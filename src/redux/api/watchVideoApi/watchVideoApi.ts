import { baseApi } from "../baseApi";

const WatchVideoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWatchVideo: builder.query({
      query: () => {
        return {
          url: "/watch-video",
          method: "GET",
        };
      },
      providesTags: ["watchVideo"],
    }),
    createWatchVideo: builder.mutation({
      query: (data) => {
        return {
          url: `/watch-video`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["watchVideo"],
    }),
    deleteWatchVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/watch-video/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["watchVideo"],
    }),
  }),
});
export const {
  useGetWatchVideoQuery,
  useCreateWatchVideoMutation,
  useDeleteWatchVideoMutation,
} = WatchVideoApi;
