"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetUrls } from "@/hooks/useGetUrls";

export default function Dashboard() {
  const { urls, isLoading, isError, mutate } = useGetUrls();

  return (
    <main className="p-6 md:min-w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Your Shortened URLs</h1>
        </div>
      </div>
      <DataTable
        columns={columns({ mutate })}
        data={urls}
        isLoading={isLoading}
        isError={isError}
      />
      <p className="text-center text-sm text-gray-600">
        The hall of fame for your little links. 🚀
      </p>
    </main>
  );
}
