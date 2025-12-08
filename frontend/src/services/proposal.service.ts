import { Proposal } from "@/types";
import { api, GeneralApiResponsePagination } from "./axios.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* MUTATIONS */
const mutations = {
  checkForProposal: (rfpId: string) => {
    return api.post<{ message: string; success: boolean }>(
      `/proposal/${rfpId}`,
      {}
    );
  },
  compareProposals: (rfpId: string) => {
    return api.post<any>(`/proposal/compare/${rfpId}`, {});
  },
};

/* QUERIES */
const queries = {
  getAllProposals: (rfpId: string) => {
    return api.get<GeneralApiResponsePagination<Proposal>>(
      `/proposal/${rfpId}`
    );
  },
  getProposals: () => {
    return api.get<GeneralApiResponsePagination<Proposal>>(`/proposal`);
  },
};

/* HOOKS */
export const useCheckProposals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.checkForProposal,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};
export const useCompareProposals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.compareProposals,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};

export const useProposals = (rfpId: string, enabled = true) => {
  return useQuery({
    queryKey: ["proposals", rfpId],
    queryFn: () => queries.getAllProposals(rfpId).then((res) => res.data),
    enabled: enabled,
  });
};

export const useProposalsAll = (enabled = true) => {
  return useQuery({
    queryKey: ["proposal"],
    queryFn: () => queries.getProposals().then((res) => res.data),
    enabled: enabled,
  });
};
