import { baseApi } from "../baseApi";

const patientSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientSummary: builder.query({
      query: () => {
        return {
          url: `/patient-summary/get-patient-summary/`,
          method: "GET",
        };
      },
      providesTags: ["patient-summary"],
    }),
  }),
});

export const { useGetPatientSummaryQuery } = patientSummaryApi;
