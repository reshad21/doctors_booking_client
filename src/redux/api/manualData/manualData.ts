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
} = onExaminationsApi;
