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
  }),
});

export const { useCreatePrescriptionPageSetupMutation } =
  prescriptionPageSetupApi;
