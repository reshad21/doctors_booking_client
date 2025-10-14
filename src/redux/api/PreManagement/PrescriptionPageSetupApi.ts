import { baseApi } from "../baseApi";

const prescriptionPageSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrescriptionPageSetup: builder.mutation({
      query: (payload) => ({
        url: `/prescription-page-setup`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["prescriptionPageSetup"],
    }),
    updatePrescriptionPageSetup: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/prescription-page-setup/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["prescriptionPageSetup"],
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
      providesTags: ["prescriptionPageSetup"],
    }),
    getPrescriptionPageSetupById: builder.query({
      query: (id) => ({
        url: `/prescription-page-setup/${id}`,
        method: "GET",
      }),
      providesTags: ["prescriptionPageSetup"],
    }),
  }),
});

export const {
  useCreatePrescriptionPageSetupMutation,
  useUpdatePrescriptionPageSetupMutation,
  useGetPrescriptionPageSetupByIdQuery,
  useGetPrescriptionPageSetupsQuery,
} = prescriptionPageSetupApi;
