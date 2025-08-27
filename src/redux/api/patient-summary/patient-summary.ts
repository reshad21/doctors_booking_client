import { baseApi } from "../baseApi";

// const patientSummaryApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getPatientSummary: builder.query({
//       query: ({name}) => {

//         return {
//           url: `/patient-summary/get-patient-summary/`,
//           method: "GET",
//         };
//       },
//       providesTags: ["patient-summary"],
//     }),
//   }),
// });

const patientSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientSummary: builder.query({
      query: ({ chamberName }) => {
        const params = new URLSearchParams();
        if (chamberName) {
          params.append('chamberName', chamberName);
        }
        
        return {
          url: `/patient-summary/get-patient-summary/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["patient-summary"],
    }),
  }),
});
export const { useGetPatientSummaryQuery } = patientSummaryApi;
