import { baseApi } from "../baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==== MESSAGES ====
    sendSingleMessage: builder.mutation({
      query: (data) => ({
        url: `/message/single-message`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message"],
    }),

    sendMultipleMessage: builder.mutation({
      query: (data) => ({
        url: `/message/message`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["message"],
    }),

    // ==== NOTICES ====
    displayNotice: builder.mutation({
      query: (data) => ({
        url: `/notice/notice-create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),

    getDisplayNotice: builder.query({
      query: ({ page, limit, searchTerm, filter }) => ({
        url: `/notice/get-notice`,
        method: "GET",
        params: { page, limit, searchTerm, filter },
      }),
      providesTags: ["notice"],
    }),

    updateDisplayNotice: builder.mutation({
      query: (data) => ({
        url: `/notice/${data?.id}`,
        method: "PUT",
        body: data?.updateValue,
      }),
      invalidatesTags: ["notice"],
    }),

    deleteDisplayNotice: builder.mutation({
      query: (id) => ({
        url: `/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
});

export const {
  useSendSingleMessageMutation,
  useSendMultipleMessageMutation,
  useDisplayNoticeMutation,
  useGetDisplayNoticeQuery,
  useDeleteDisplayNoticeMutation,
  useUpdateDisplayNoticeMutation,
} = messageApi;
