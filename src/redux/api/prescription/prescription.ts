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
      invalidatesTags: (_result, _error, arg) => [
        "prescription",
        "patient",
        { type: "prescription", id: arg.patientId },
        { type: "patient", id: arg.patientId },
      ],
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
      invalidatesTags: (_result, _error, { patientId }) => [
        { type: "prescription", id: patientId },
      ],
    }),
    getPerceptionByPatientId: builder.query({
      query: (patientId) => {
        return {
          url: `/prescription/${patientId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, patientId) => [
        { type: "prescription", id: patientId },
      ],
    }),
    getPerceptionBId: builder.query({
      query: ({ prescriptionId }) => {
        return {
          url: `/prescription/single/${prescriptionId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { prescriptionId }) => [
        { type: "prescription", id: prescriptionId },
      ],
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
  useGetPerceptionBIdQuery,
  useUpdatePrescriptionMutation,
  useCreateExtraAdviceMutation,
  useGetExtraAdviceQuery,
} = prescriptionApi;
