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
  }),
});

export const {useSendSingleMessageMutation} = messageApi;
