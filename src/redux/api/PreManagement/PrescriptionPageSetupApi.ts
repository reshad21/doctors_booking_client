import { baseApi } from "../baseApi";

const prescriptionPageSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrescriptionPageSetup: builder.mutation({
      query: (payload) => ({
        url: `/prescription-page-setup`,
        method: "POST",
        body: payload,
      }),
    }),
    getPrescriptionPageSetups: builder.query({
      query: ({ doctorId }) => {
        const params = new URLSearchParams();
        if (doctorId) {
          params.append("doctorId", doctorId.toString());
        }
        return {
          url: `/prescription-page-setup?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreatePrescriptionPageSetupMutation,
  useGetPrescriptionPageSetupsQuery,
} = prescriptionPageSetupApi;
