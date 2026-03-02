import { baseApi } from "./baseApi";

const PRODUCTS_URL = "/products";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page);
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.search) searchParams.set("search", params.search);
        if (params.league) searchParams.set("league", params.league);
        const qs = searchParams.toString();
        return `${PRODUCTS_URL}${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map((p) => ({ type: "Product", id: p._id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
