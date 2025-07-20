import { baseApi } from "../baseApi";

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation({
      query: (data) => {
        return {
          url: `/patients/create-patient`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["patient"],
    }),
    getPatient: builder.query({
      query: () => {
        return {
          url: `/patients/get-all-patients`,
          method: "GET",
        };
      },
      providesTags: ["patient"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["patient"],
    }),
    updatePatient: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["patient"],
    }),
  }),
});

export const {
  useCreatePatientMutation,
  useGetPatientQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
