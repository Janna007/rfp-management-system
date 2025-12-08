import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_URL;
export const API_URL = `${baseUrl}/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type GeneralApiResponse<T = unknown> = {
  message: string;
  data: T;
};

export type GeneralApiResponsePagination<T = unknown> = {
  message: string;
  data: T[];
  total: number;
};
