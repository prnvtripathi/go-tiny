"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  ChartSpline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Url } from "@/types";

export const columns = ({
  mutate,
}: {
  mutate: () => void;
}): ColumnDef<Url>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronUp className="ml-2 h-4 w-4 transform rotate-180 transition-transform duration-200" />
            )
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </span>
      );
    },
  },
  {
    header: "Original URL",
    accessorKey: "original_url",
  },
  {
    header: "Short URL",
    accessorKey: "short_code",
    cell: ({ row }) => {
      const short_url: string = row.getValue("short_code");
      return (
        <Link
          href={short_url}
          className="text-blue-600 underline underline-offset-2 dark:text-blue-300"
          target="_blank"
        >
          {short_url}
        </Link>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <span
          className="flex items-center justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expires At
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronUp className="ml-2 h-4 w-4 transform rotate-180 transition-transform duration-200" />
            )
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </span>
      );
    },
    accessorKey: "expires_at",
    cell: ({ row }) => {
      let expires_at: Date = row.getValue("expires_at");

      // Ensure expires_at is a Date object
      if (!(expires_at instanceof Date)) {
        expires_at = new Date(expires_at);
      }

      const formattedDate = expires_at.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const now = new Date();
      const timeDiff = expires_at.getTime() - now.getTime();
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;

      let dateClass = "text-green-600 dark:text-green-400"; // Default color (for more than 2 days)
      if (timeDiff < 0) {
        dateClass = "text-red-600 dark:text-red-400"; // Past date
      } else if (timeDiff <= twoDaysInMillis) {
        dateClass = "text-yellow-600 dark:text-yellow-400"; // 2 days or less
      }

      return <span className={dateClass}>{formattedDate}</span>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <span
          className="flex items-center justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clicks
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronUp className="ml-2 h-4 w-4 transform rotate-180 transition-transform duration-200" />
            )
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </span>
      );
    },
    accessorKey: "click_count",
    cell: ({ row }) => {
      const click_count: number = row.getValue("click_count");
      return (
        <span className="flex justify-center items-center">{click_count}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const url = row.original;
      const url_id = url.url_id;

      const handleDelete = async (id: number) => {
        try {
          const response = await fetch(`/api/backend/deleteUrl`, {
            body: JSON.stringify({ url_id: id }),
            method: "DELETE",
          });
          const data = await response.json();
          toast.success(data.message);
          // Revalidate the data after successful deletion
          mutate();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete URL");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(url.short_code);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
              Copy Short URL
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/analytics/${url_id}`}
                className="flex items-center gap-1"
              >
                <ChartSpline className="h-4 w-4" />
                View Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-800/20"
              onClick={() => handleDelete(url.url_id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // {
  //     header: 'Clicks',
  //     accessorKey: 'clicks',
  // },
];
