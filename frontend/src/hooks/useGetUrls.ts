import useSWR from 'swr'
import { Url } from '@/app/dashboard/home/columns'

interface UrlResponse {
    urls: Url[]
}

// Define fetcher function
const fetcher = async (url: string): Promise<UrlResponse> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch URLs')
    }
    return response.json()
}

export function useGetUrls() {
    const { data, error, isLoading, mutate } = useSWR<UrlResponse>(
        '/api/backend/getUrls',
        fetcher
    )

    return {
        urls: data?.urls ?? [],
        isLoading,
        isError: error,
        mutate,
    }
}
