import { baseApi } from "../baseApi";

const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrescription: builder.mutation({
      query: (prescriptionData) => {
        return {
          url: `/prescription/create-prescription`,
          method: "POST",
          body: prescriptionData,
        };
      },
      invalidatesTags: ["prescription"],
    }),
    createExtraAdvice: builder.mutation({
      query: (adviceData) => {
        return {
          url: `/prescription/create-createExtraAdvice`,
          method: "POST",
          body: adviceData,
        };
      },
      invalidatesTags: ["prescription"],
    }),
    updatePrescription: builder.mutation({
      query: (prescriptionData) => {
        return {
          url: `/prescription/update-prescription`,
          method: "PATCH",
          body: prescriptionData,
        };
      },
      invalidatesTags: ["prescription"],
    }),
    getPerceptionByPatientId: builder.query({
      query: (patientId) => {
        return {
          url: `/prescription/${patientId}`,
          method: "GET",
        };
      },
    }),
    getExtraAdvice: builder.query({
      query: () => {
        return {
          url: `prescription/exceptional-advice`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetPerceptionByPatientIdQuery,
  useUpdatePrescriptionMutation,
  useCreateExtraAdviceMutation,
  useGetExtraAdviceQuery
} = prescriptionApi;
