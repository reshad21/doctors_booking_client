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
  }),
});

export const { useCreatePrescriptionMutation,useGetPerceptionByPatientIdQuery,useUpdatePrescriptionMutation} = prescriptionApi;