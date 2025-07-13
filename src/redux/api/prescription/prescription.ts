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
  }),
});

export const { useCreatePrescriptionMutation} = prescriptionApi;