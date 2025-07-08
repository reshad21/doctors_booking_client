import { baseApi } from "../baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation({
      query: (data) => {
        return {
          url: `/patients/create-patient`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["staff"],
    }),
  }),
});
export const {
  useCreatePatientMutation,
} = staffApi;
