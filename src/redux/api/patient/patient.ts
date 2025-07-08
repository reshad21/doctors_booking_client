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
  }),
});

export const { useCreatePatientMutation } = patientApi;
