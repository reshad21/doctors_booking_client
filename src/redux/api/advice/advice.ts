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

    // getChambers: builder.query({
    //   query: ({ searchTerm }) => ({
    //     url: `/chamber/get-chambers`,
    //     params: { searchTerm },
    //   }),
    //   providesTags: ["chamber"],
    // }),

    // getChamberById: builder.query({
    //   query: (id: string) => ({
    //     url: `/chamber/${id}`,
    //   }),
    //   providesTags: ["chamber"],
    // }),

    // updateChamber: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `/chamber/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["chamber"],
    // }),

    // deleteChamber: builder.mutation({
    //   query: (id: string) => ({
    //     url: `/chamber/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["chamber"],
    // }),
  }),
});

export const { useCreateAdviceMutation } = adviceApi;
