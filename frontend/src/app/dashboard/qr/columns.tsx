"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  QrCode,
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
import { QR } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toPng } from "html-to-image";

export const columns = ({
  mutate,
}: {
  mutate: () => void;
}): ColumnDef<QR>[] => [
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
    header: "QR Code",
    accessorKey: "base64",
    cell: ({ row }) => {
      const base_64: string = row.getValue("base64");
      return (
        <Dialog>
          <DialogTrigger asChild>
            <QrCode className="h-6 w-6" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code to open the URL
              </DialogDescription>
            </DialogHeader>
            <Image
              src={`data:image/png;base64,${base_64}`}
              alt="QR Code"
              width={500}
              height={500}
              id="qr-code"
            />
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(base_64)}
              >
                Copy QR Code as Base64
              </Button>
              <Button
                onClick={async () => {
                  const node = document.getElementById("qr-code");
                  if (!node) {
                    toast.error("QR code container not found");
                    return;
                  }

                  try {
                    const dataUrl = await toPng(node);
                    const response = await fetch(dataUrl);
                    const blob = await response.blob();

                    // Copy the blob to the clipboard
                    await navigator.clipboard.write([
                      new ClipboardItem({ "image/png": blob }),
                    ]);
                    toast.success("Copied QR code as image");
                  } catch (error) {
                    console.error("Failed to copy QR code image:", error);
                    toast.error("Failed to copy QR code as image");
                  }
                }}
              >
                Copy QR Code as Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const url = row.original;

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
          toast.error("Failed to delete QR");
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-800/20"
              onClick={() => handleDelete(url.url_id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete QR
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
