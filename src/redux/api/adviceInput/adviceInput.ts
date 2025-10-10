import { baseApi } from "../baseApi";

const adviceInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdviceInput: builder.mutation({
      query: (data) => ({
        url: "/advice-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["advice-input"],
    }),
    getAdviceInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/advice-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getAdviceInputById: builder.query({
      query: (id: string) => ({
        url: `/advice-input/${id}`,
        method: "GET",
      }),
      providesTags: ["advice-input"],
    }),
    updateAdviceInput: builder.mutation({
      query: (data) => ({
        url: `/advice-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["advice-input"],
    }),
    deleteAdviceInput: builder.mutation({
      query: (id: string) => ({
        url: `/advice-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["advice-input"],
    }),
  }),
});

export const {
  useCreateAdviceInputMutation,
  useGetAdviceInputsQuery,
  useGetAdviceInputByIdQuery,
  useUpdateAdviceInputMutation,
  useDeleteAdviceInputMutation,
} = adviceInputApi;
