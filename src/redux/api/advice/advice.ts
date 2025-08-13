import { baseApi } from "../baseApi";

const adviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdvice: builder.mutation({
      query: (data) => ({
        url: `/advice/advice-create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["advice"],
    }),

    getAdvice: builder.query({
      query: () => ({
        url: `/advice/get-advice`,
        // params: { searchTerm },
      }),
      providesTags: ["advice"],
    }),

    // 

    updateAdvice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["advice"],
    }),

    deleteAdvice: builder.mutation({
      query: (id: string) => ({
        url: `/advice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["advice"],
    }),
  }),
});

export const { useCreateAdviceMutation, useGetAdviceQuery, useDeleteAdviceMutation, useUpdateAdviceMutation } = adviceApi;
