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
      query: ({ chamberId }) => {
        const params = new URLSearchParams();
        if (chamberId) {
          params.append('chamberId', chamberId);
        }
        
        return {
          url: `/patient-summary/get-patient-summary/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["patient-summary","patient"],
    }),
  }),
});
export const { useGetPatientSummaryQuery } = patientSummaryApi;
