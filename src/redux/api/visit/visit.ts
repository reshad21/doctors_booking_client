import { baseApi } from "../baseApi";

const visitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisits: builder.query({
      query: ({ searchTerm, filter }) => {
        return {
          url: "/visit/get-visits",
          method: "GET",
          params: {
            searchTerm,
            filter,
          },
        };
      },
      providesTags: ["visit"],
    }),
  }),
});

export const { useGetVisitsQuery } = visitApi;
