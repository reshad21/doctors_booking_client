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
    updateIsArrivedPatient: builder.mutation({
      query: (data) => {
        console.log(data);
        
        return {
          url: `/patients/update-isArrived-status`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["patient"],
    }),
    getPatient: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => {
        return {
          url: `/patients/get-all-patients/`,
          method: "GET",
          params: {
            page,
            limit,
            searchTerm,
            filter,
            orderBy
          },
        };
      },
      providesTags: ["patient"],
    }),

    getSinglePatient: builder.query({
      query: ({id}) => {
        return {
          url: `/patients/get-patient/${id}`,
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
  useUpdateIsArrivedPatientMutation,
  useGetSinglePatientQuery,
} = patientApi;
