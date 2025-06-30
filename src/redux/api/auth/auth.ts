import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => {
        return {
            url: "/auth/login",
            method: "POST",
            body: payload,
          }
      },
    }),
   
  }),
});
export const {useLoginUserMutation,} = authApi;
