import { baseApi } from "../baseApi";

const onExaminationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOnExaminations: builder.mutation({
      query: (data) => ({
        url: `/on-examination/create-onExamination`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createChiefComplaint: builder.mutation({
      query: (data) => ({
        url: `/chief-complaint/create-chiefComplaint`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createInvestigation: builder.mutation({
      query: (data) => ({
        url: `/investigation/create-investigation`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createDiagnosis: builder.mutation({
      query: (data) => ({
        url: `/diagnosis/create-diagnosis`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createMedicineTime: builder.mutation({
      query: (data) => ({
        url: `/medicine-time/create-medicine-time`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createMedicineDosages: builder.mutation({
      query: (data) => ({
        url: `/medicine-dosages/create-medicine-dosages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createMedicineDosagesDayInput: builder.mutation({
      query: (data) => ({
        url: `/medicine-dosages-frequency-day/create-medicine-dosages-frequency-day`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    createMedicineDosagesDayName: builder.mutation({
      query: (data) => ({
        url: `/medicine-dosages-frequency-name/create-medicine-dosages-frequency-name`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manualData"],
    }),

    getOnExaminations: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/on-examination/get-onExaminations`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getInvestigation: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/investigation/get-investigations`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getDiagnosis: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/diagnosis/get-diagnoses`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getChiefComplaint: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/chief-complaint/get-chiefComplaints`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getMedicinesList: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/medicines/get-medicines`,
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getMedicinesTime: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/medicine-time/get-medicine-time`,
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getMedicinesDosages: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/medicine-dosages/get-medicine-dosages`,
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getMedicineDosagesDayInputQuery: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/medicine-dosages-frequency-day/get-medicine-dosages-frequency-day`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),

    getMedicineDosagesDayNameQuery: builder.query({
      query: ({ page, limit, searchTerm, filter, orderBy }) => ({
        url: `/medicine-dosages-frequency-name/get-medicine-dosages-frequency-name`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          filter,
          orderBy,
        },
      }),
      providesTags: ["manualData"],
    }),
  }),
});

export const {
  useCreateOnExaminationsMutation,
  useGetOnExaminationsQuery,
  useCreateInvestigationMutation,
  useGetInvestigationQuery,
  useCreateDiagnosisMutation,
  useGetDiagnosisQuery,
  useCreateChiefComplaintMutation,
  useGetChiefComplaintQuery,
  useGetMedicinesListQuery,
  useCreateMedicineTimeMutation,
  useGetMedicinesDosagesQuery,
  useGetMedicinesTimeQuery,
  useCreateMedicineDosagesMutation,
  useCreateMedicineDosagesDayInputMutation,
  useCreateMedicineDosagesDayNameMutation,
  useGetMedicineDosagesDayInputQueryQuery,
  useGetMedicineDosagesDayNameQueryQuery,
} = onExaminationsApi;
