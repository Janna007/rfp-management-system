import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./axios.service";
import { ParsedRFP, QueryObj, RFP } from "@/types";


/* MUTATIONS */
const mutations = {
  parseRfpInput: (data: { naturalLanguageText: string }) => {
    return api.post<GeneralApiResponse<ParsedRFP>>("/rfp", data);
  },
  createRfp: (data: {parsedRFP: ParsedRFP}) => {
    return api.post<GeneralApiResponse<RFP>>("/rfp/create", data);
  },
  sendRfpToVendor: (data: { vendorIds: string[]; rfpId: string }) => {
    return api.post<GeneralApiResponse<RFP>>(`/rfp/${data?.rfpId}`, data);
  },
};

/* QUERIES */
const queries = {
  getAllRfp: (queryObj: QueryObj) => {
    const query = new URLSearchParams(
      queryObj as Record<string, string>
    ).toString();
    return api.get<GeneralApiResponsePagination<RFP>>(`/rfp?${query}`);
  },
  getRfpById: (rfpId: string) => {
    return api.get<GeneralApiResponse<RFP>>(`/rfp/${rfpId}`);
  },
};

/* HOOKS */
export const useParseRfpInput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.parseRfpInput,
    onSuccess: (res) => {
      //   queryClient.invalidateQueries({ queryKey: ["rfp"] });
    },
  });
};
export const useCreateRfp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.createRfp,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["rfps"] });
    },
  });
};
export const useSendRfpToVendors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.sendRfpToVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["rfps"] });
      queryClient.invalidateQueries({ queryKey: ["rfp"] });
    },
  });
};

export const useRfps = (queryObj: QueryObj) => {
  return useQuery({
    queryKey: ["rfps", queryObj],
    queryFn: () => queries.getAllRfp(queryObj).then((res) => res.data),
  });
};

export const useRfp = (rfpId: string, enabled = true) => {
  return useQuery({
    queryKey: ["rfp", rfpId],
    queryFn: () => queries.getRfpById(rfpId).then((res) => res.data),
    enabled: enabled,
  });
};
