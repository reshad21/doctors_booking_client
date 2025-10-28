import { baseApi } from "../baseApi";

const chiefComplaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChiefComponentInput: builder.mutation({
      query: (data) => ({
        url: "/chief-complaint-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chief-complaint-input"],
    }),
    getChiefComponentInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }

        return {
          url: `/chief-complaint-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getChiefComponentInputById: builder.query({
      query: (id: string) => ({
        url: `/chief-complaint-input/${id}`,
        method: "GET",
      }),
      providesTags: ["chief-complaint-input"],
    }),
    updateChiefComponentInput: builder.mutation({
      query: (data) => ({
        url: `/chief-complaint-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["chief-complaint-input"],
    }),
    deleteChiefComponentInput: builder.mutation({
      query: (id: string) => ({
        url: `/chief-complaint-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chief-complaint-input"],
    }),
  }),
});

export const {
  useCreateChiefComponentInputMutation,
  useGetChiefComponentInputsQuery,
  useGetChiefComponentInputByIdQuery,
  useUpdateChiefComponentInputMutation,
  useDeleteChiefComponentInputMutation,
} = chiefComplaintApi;
