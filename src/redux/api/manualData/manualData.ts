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
      query: (data) => ({
        url: `/on-examination/get-onExaminations`,
        method: "GET",
        body: data,
      }),
      providesTags: ["manualData"],
    }),
    getInvestigation: builder.query({
      query: (data) => ({
        url: `/investigation/get-investigations`,
        method: "GET",
        body: data,
      }),
      providesTags: ["manualData"],
    }),
    getDiagnosis: builder.query({
      query: (data) => ({
        url: `/diagnosis/get-diagnoses`,
        method: "GET",
        body: data,
      }),
      providesTags: ["manualData"],
    }),
    getChiefComplaint: builder.query({
      query: (data) => ({
        url: `/chief-complaint/get-chiefComplaints`,
        method: "GET",
        body: data,
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
