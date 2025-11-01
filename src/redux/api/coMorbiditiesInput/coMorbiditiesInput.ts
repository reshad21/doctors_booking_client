import { baseApi } from "../baseApi";

const coMorbiditiesInputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCoMorbiditiesInput: builder.mutation({
      query: (data) => ({
        url: "/co-morbidities-input",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["co-morbidities-input"],
    }),

    getCoMorbiditiesInputs: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.length > 0) {
          query.forEach((item: { key: string; value: string }) => {
            params.append(item.key, item.value);
          });
        }
        return {
          url: `/co-morbidities-input?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getCoMorbiditiesInputById: builder.query({
      query: (id: string) => ({
        url: `/co-morbidities-input/${id}`,
        method: "GET",
      }),
      providesTags: ["co-morbidities-input"],
    }),

    updateCoMorbiditiesInput: builder.mutation({
      query: (data) => ({
        url: `/co-morbidities-input/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["co-morbidities-input"],
    }),
    
    deleteCoMorbiditiesInput: builder.mutation({
      query: (id: string) => ({
        url: `/co-morbidities-input/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["co-morbidities-input"],
    }),
  }),
});

export const {
  useCreateCoMorbiditiesInputMutation,
  useGetCoMorbiditiesInputsQuery,
  useGetCoMorbiditiesInputByIdQuery,
  useUpdateCoMorbiditiesInputMutation,
  useDeleteCoMorbiditiesInputMutation,
} = coMorbiditiesInputApi;
