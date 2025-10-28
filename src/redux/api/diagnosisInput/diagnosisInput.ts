import { baseApi } from "../baseApi";

const diagnosisInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDiagnosisInput: builder.mutation({
      query: (data) => ({
        url: "/diagnosis-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["diagnosis-input"],
    }),
    getDiagnosisInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/diagnosis-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getDiagnosisInputById: builder.query({
      query: (id: string) => ({
        url: `/diagnosis-input/${id}`,
        method: "GET",
      }),
      providesTags: ["diagnosis-input"],
    }),
    updateDiagnosisInput: builder.mutation({
      query: (data) => ({
        url: `/diagnosis-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["diagnosis-input"],
    }),
    deleteDiagnosisInput: builder.mutation({
      query: (id: string) => ({
        url: `/diagnosis-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["diagnosis-input"],
    }),
  }),
});

export const {
  useCreateDiagnosisInputMutation,
  useGetDiagnosisInputsQuery,
  useGetDiagnosisInputByIdQuery,
  useUpdateDiagnosisInputMutation,
  useDeleteDiagnosisInputMutation,
} = diagnosisInputApi;
