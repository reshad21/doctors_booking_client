import { baseApi } from "../baseApi";

const medicineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query) {
          query.forEach((q: { key: string; value: string }) => {
            params.append(q.key, q.value);
          });
        }
        return {
          url: `/medicines/get-medicines?${params.toString()}`,
        };
      },
      providesTags: ["medicine"],
    }),
    createMedicine: builder.mutation({
      query: (data) => ({
        url: "/medicines",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["medicine"],
    }),
    updateMedicine: builder.mutation({
      query: ({ id, data }) => ({
        url: `/medicines/${id}`,
        body: data,
        method: "PUT",
      }),
      invalidatesTags: ["medicine"],
    }),
    deleteMedicine: builder.mutation({
      query: (id) => ({
        url: `/medicines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["medicine"],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApi;
