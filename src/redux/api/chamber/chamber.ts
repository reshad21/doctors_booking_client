import { baseApi } from "../baseApi";

const chamberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChamber: builder.mutation({
      query: (data) => ({
        url: `/chamber/create-chamber`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chamber"],
    }),

    getChambers: builder.query({
      query: ({ searchTerm }) => ({
        url: `/chamber/get-chambers`,
        params: { searchTerm },
      }),
      providesTags: ["chamber"],
    }),

    getChamberById: builder.query({
      query: (id: string) => ({
        url: `/chamber/${id}`,
      }),
      providesTags: ["chamber"],
    }),

    updateChamber: builder.mutation({
      query: ({ id, data }) => ({
        url: `/chamber/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["chamber"],
    }),

    deleteChamber: builder.mutation({
      query: (id: string) => ({
        url: `/chamber/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chamber"],
    }),
  }),
});

export const {
  useCreateChamberMutation,
  useGetChambersQuery,
  useGetChamberByIdQuery,
  useUpdateChamberMutation,
  useDeleteChamberMutation,
} = chamberApi;
