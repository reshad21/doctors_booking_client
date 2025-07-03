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
      providesTags: ["watch-video"],
    }),
    createWatchVideo: builder.mutation({
      query: (data) => {
        return {
          url: `/watch-video`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["watch-video"],
    }),
    deleteWatchVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/watch-video/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["watch-video"],
    }),
  }),
});
export const {
  useGetWatchVideoQuery,
  useCreateWatchVideoMutation,
  useDeleteWatchVideoMutation,
} = WatchVideoApi;
