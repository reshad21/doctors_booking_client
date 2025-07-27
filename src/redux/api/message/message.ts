import { baseApi } from "../baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendSingleMessage: builder.mutation({
      query: (data) => {
        return {
          url: `/message/single-message`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    sendMultipleMessage: builder.mutation({
      query: (data) => {
        return {
          url: `/message/message`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    displayNotice: builder.mutation({
      query: (data) => {
        return {
          url: `/notice/notice-create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    getDisplayNotice: builder.query({
      query: ({ page, limit, searchTerm, filter }) => {
        return {
          url: `/notice/get-notice`,
          method: "GET",
          params: {
            page,
            limit,
            searchTerm,
            filter,
          },
        };
      },
      providesTags: ["patient"],
    }),
  }),
});

export const {useSendSingleMessageMutation,useSendMultipleMessageMutation,useDisplayNoticeMutation,useGetDisplayNoticeQuery} = messageApi;
