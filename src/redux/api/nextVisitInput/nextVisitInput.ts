import { baseApi } from "../baseApi";

const nextVisitInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNextVisitInput: builder.mutation({
      query: (data) => ({
        url: "/next-visit-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["next-visit-input"],
    }),
    getNextVisitInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/next-visit-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getNextVisitInputById: builder.query({
      query: (id: string) => ({
        url: `/next-visit-input/${id}`,
        method: "GET",
      }),
      providesTags: ["next-visit-input"],
    }),
    updateNextVisitInput: builder.mutation({
      query: (data) => ({
        url: `/next-visit-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["next-visit-input"],
    }),
    deleteNextVisitInput: builder.mutation({
      query: (id: string) => ({
        url: `/next-visit-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["next-visit-input"],
    }),
  }),
});

export const {
  useCreateNextVisitInputMutation,
  useGetNextVisitInputsQuery,
  useGetNextVisitInputByIdQuery,
  useUpdateNextVisitInputMutation,
  useDeleteNextVisitInputMutation,
} = nextVisitInputApi;
