import { baseApi } from "../baseApi";

const historyInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHistoryInput: builder.mutation({
      query: (data) => ({
        url: "/history-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["history-input"],
    }),
    getHistoryInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/history-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getHistoryInputById: builder.query({
      query: (id: string) => ({
        url: `/history-input/${id}`,
        method: "GET",
      }),
      providesTags: ["history-input"],
    }),
    updateHistoryInput: builder.mutation({
      query: (data) => ({
        url: `/history-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["history-input"],
    }),
    deleteHistoryInput: builder.mutation({
      query: (id: string) => ({
        url: `/history-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["history-input"],
    }),
  }),
});

export const {
  useCreateHistoryInputMutation,
  useGetHistoryInputsQuery,
  useGetHistoryInputByIdQuery,
  useUpdateHistoryInputMutation,
  useDeleteHistoryInputMutation,
} = historyInputApi;
