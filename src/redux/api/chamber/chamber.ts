import { baseApi } from "../baseApi";

const chamberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChamber: builder.mutation({
      query: (data) => {
        return {
          url: `/chamber/create-chamber`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["chamber"],
    }),
  }),
});

export const { useCreateChamberMutation } = chamberApi;
