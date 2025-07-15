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
    getOnlyActiveVideo: builder.query({
      query: () => {
        return {
          url: "/watch-video/active",
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
    updateWatchVideo: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/watch-video/${id}`,
          method: "PATCH",
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
  useGetOnlyActiveVideoQuery,
  useCreateWatchVideoMutation,
  useDeleteWatchVideoMutation,
  useUpdateWatchVideoMutation,
} = WatchVideoApi;
