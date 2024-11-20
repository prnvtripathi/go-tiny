"use client";

import { useGetQrs } from "@/hooks/useGetQRs";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function Dashboard() {
  const { qrs, isLoading, isError, mutate } = useGetQrs();
  return (
    <main className="p-6 md:min-w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Your QRs</h1>
        </div>
      </div>
      <DataTable
        columns={columns({ mutate })}
        data={qrs}
        isLoading={isLoading}
        isError={isError}
      />
      <p className="text-center text-sm text-gray-600">
        The hall of fame for your little links. 🚀
      </p>
    </main>
  );
}
