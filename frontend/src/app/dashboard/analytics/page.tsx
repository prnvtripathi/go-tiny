"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUrls } from "@/hooks/useGetUrls";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const { urls, isLoading, isError } = useGetUrls();

  const handleUrlSelect = (urlId: string) => {
    router.push(`/dashboard/analytics/${urlId}`);
  };

  return (
    <main className="p-6 md:min-w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            How are your tiny links performing?
          </h1>
        </div>
      </div>
      <Select onValueChange={handleUrlSelect} disabled={isLoading}>
        <SelectTrigger className="bg-white dark:bg-black text-gray-900 dark:text-white">
          <SelectValue
            placeholder={isLoading ? "Loading links..." : "Select the link"}
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading links...</p>
            </div>
          ) : (
            urls?.map((url) => (
              <SelectItem key={url.url_id} value={String(url.url_id)}>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {url?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {url?.original_url}
                  </p>
                </div>
              </SelectItem>
            ))
          )}
          {isError && <p className="p-2 text-red-500">Error loading URLs</p>}
        </SelectContent>
      </Select>
    </main>
  );
}
