"use client";

import { Plus } from "lucide-react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UrlShortenerForm from "@/components/url-shortener-form";
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New URL
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New URL</DialogTitle>
              <DialogDescription>Add a new URL to shorten</DialogDescription>
            </DialogHeader>
            <UrlShortenerForm isDialog={true} />
          </DialogContent>
        </Dialog>
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
