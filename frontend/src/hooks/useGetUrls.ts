import useSWR from "swr";
import { Url } from "@/types";

interface UrlResponse {
  urls: Url[];
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

export function useGetUrls() {
  const { data, error, isLoading, mutate } = useSWR<UrlResponse>(
    "/api/backend/getUrls",
    fetcher
  );

  return {
    urls: data?.urls ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
