import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query({
      query: () => `${AUTH_URL}/me`,
      providesTags: [{ type: "User", id: "ME" }],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/me`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
