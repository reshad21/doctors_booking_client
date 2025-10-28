import { baseApi } from "../baseApi";

const investigationInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvestigationInput: builder.mutation({
      query: (data) => ({
        url: "/investigation-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["investigation-input"],
    }),
    getInvestigationInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/investigation-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getInvestigationInputById: builder.query({
      query: (id: string) => ({
        url: `/investigation-input/${id}`,
        method: "GET",
      }),
      providesTags: ["investigation-input"],
    }),
    updateInvestigationInput: builder.mutation({
      query: (data) => ({
        url: `/investigation-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["investigation-input"],
    }),
    deleteInvestigationInput: builder.mutation({
      query: (id: string) => ({
        url: `/investigation-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["investigation-input"],
    }),
  }),
});

export const {
  useCreateInvestigationInputMutation,
  useGetInvestigationInputsQuery,
  useGetInvestigationInputByIdQuery,
  useUpdateInvestigationInputMutation,
  useDeleteInvestigationInputMutation,
} = investigationInputApi;
