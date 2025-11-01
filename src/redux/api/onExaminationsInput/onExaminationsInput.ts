import { baseApi } from "../baseApi";

const onExaminationsInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOnExaminationsInput: builder.mutation({
      query: (data) => ({
        url: "/on-examinations-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["on-examinations-input"],
    }),
    getOnExaminationsInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/on-examinations-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getOnExaminationsInputById: builder.query({
      query: (id: string) => ({
        url: `/on-examinations-input/${id}`,
        method: "GET",
      }),
      providesTags: ["on-examinations-input"],
    }),
    updateOnExaminationsInput: builder.mutation({
      query: (data) => ({
        url: `/on-examinations-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["on-examinations-input"],
    }),
    deleteOnExaminationsInput: builder.mutation({
      query: (id: string) => ({
        url: `/on-examinations-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["on-examinations-input"],
    }),
  }),
});

export const {
  useCreateOnExaminationsInputMutation,
  useGetOnExaminationsInputsQuery,
  useGetOnExaminationsInputByIdQuery,
  useUpdateOnExaminationsInputMutation,
  useDeleteOnExaminationsInputMutation,
} = onExaminationsInputApi;
