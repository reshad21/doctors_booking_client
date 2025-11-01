import { baseApi } from "../baseApi";

const clinicalNoteTemplate = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClinicalTemplate: builder.mutation({
      query: (payload) => ({
        url: "/clinical-template",
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["clinicTemplate"],
    }),
    getClinicTemplate: builder.query({
      query: () => ({
        url: "/clinical-template",
        method: "GET",
      }),
      providesTags: ["clinicTemplate"],
    }),
    updateClinicalTemplate: builder.mutation({
      query: (payload) => ({
        url: "/clinical-template",
        body: payload,
        method: "PUT",
      }),
      invalidatesTags: ["clinicTemplate"],
    }),
  }),
});

export const {
  useCreateClinicalTemplateMutation,
  useGetClinicTemplateQuery,
  useUpdateClinicalTemplateMutation,
} = clinicalNoteTemplate;
