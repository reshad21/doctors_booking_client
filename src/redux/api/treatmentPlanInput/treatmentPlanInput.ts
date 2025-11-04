import { baseApi } from "../baseApi";

const treatmentPlanInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTreatmentPlanInput: builder.mutation({
      query: (data) => ({
        url: "/treatment-plan-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["treatment-plan-input"],
    }),
    
    getTreatmentPlanInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/treatment-plan-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getTreatmentPlanInputById: builder.query({
      query: (id: string) => ({
        url: `/treatment-plan-input/${id}`,
        method: "GET",
      }),
      providesTags: ["treatment-plan-input"],
    }),

    updateTreatmentPlanInput: builder.mutation({
      query: (data) => ({
        url: `/treatment-plan-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["treatment-plan-input"],
    }),
    
    deleteTreatmentPlanInput: builder.mutation({
      query: (id: string) => ({
        url: `/treatment-plan-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["treatment-plan-input"],
    }),
  }),
});

export const {
  useCreateTreatmentPlanInputMutation,
  useGetTreatmentPlanInputsQuery,
  useGetTreatmentPlanInputByIdQuery,
  useUpdateTreatmentPlanInputMutation,
  useDeleteTreatmentPlanInputMutation,
} = treatmentPlanInputApi;
