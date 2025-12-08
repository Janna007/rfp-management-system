import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./axios.service";
import { QueryObj, Vendor } from "@/types";

/* MUTATIONS */
const mutations = {
  createVendor: (data: Partial<Vendor>) => {
    return api.post<GeneralApiResponse<Vendor>>("/vendor", data);
  },
  updateVendor: (data: Partial<Vendor>) => {
    return api.patch<GeneralApiResponse<Vendor>>(`/vendor/${data?._id}`, data);
  },
  deleteVendor: (vendorId: string) => {
    return api.delete<GeneralApiResponse<Vendor>>(`/vendor/${vendorId}`);
  },
};

/* QUERIES */
const queries = {
  getVendors: (queryObj: QueryObj) => {
    const query = new URLSearchParams(
      queryObj as Record<string, string>
    ).toString();
    return api.get<GeneralApiResponsePagination<Vendor>>(`/vendor?${query}`);
  },
  getVendorById: (vendorId: string) => {
    return api.get<GeneralApiResponse<Vendor>>(`/vendor/${vendorId}`);
  },
};

/* HOOKS */
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.createVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.updateVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.deleteVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useVendors = (queryObj: QueryObj) => {
  return useQuery({
    queryKey: ["vendors", queryObj],
    queryFn: () => queries.getVendors(queryObj).then((res) => res.data),
  });
};

export const useVendor = (vendorId: string, enabled = true) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => queries.getVendorById(vendorId).then((res) => res.data),
    enabled: enabled,
  });
};
