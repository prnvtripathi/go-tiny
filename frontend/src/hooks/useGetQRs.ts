import useSWR from "swr";
import { QR } from "@/types";

interface UrlResponse {
  qrs: QR[];
}

// Define fetcher function
const fetcher = async (url: string): Promise<UrlResponse> => {
  const response = await fetch(url);
  if (!response.ok && response.status === 429) {
    throw new Error("Too Many Requests. Cool down buddy!");
  } else if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }
  return response.json();
};

export function useGetQrs() {
  const { data, error, isLoading, mutate } = useSWR<UrlResponse>(
    "/api/backend/getQrs",
    fetcher
  );

  return {
    qrs: data?.qrs ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
