import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: () => ({}),
    overrideExisting: false,
});
