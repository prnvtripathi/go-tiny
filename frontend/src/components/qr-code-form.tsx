"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { formatRFC3339, format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function QRCodeForm({ isDialog }: { isDialog?: boolean }) {
  // Form state
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [expiryOption, setExpiryOption] = useState("");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDate = calculateExpiryDate();

    const responseFromShortURL = await fetch(`/api/backend/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        name,
        code: {
          shortCode: "",
          isCustomCode: false,
        },
        expiryDate,
        isCustomExpiry: expiryOption === "custom",
      }),
    });

    const data = await responseFromShortURL.json();

    const response = await fetch(`/api/backend/generateqr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: data.original_url,
        url_id: data.url_id,
        short_code: data.code,
        size: 5,
        error_correction: "M",
      }),
    });

    const qrData = await response.json();

    if (qrData?.success) {
      toast.success("QR created successfully");
      router.push(`/dashboard/qr`);
    } else {
      toast.error(qrData?.data?.message);
    }
  };

  const calculateExpiryDate = () => {
    switch (expiryOption) {
      case "1":
        return formatRFC3339(new Date(Date.now() + 86400000));
      case "7":
        return formatRFC3339(new Date(Date.now() + 604800000));
      case "custom":
        return customDate ? formatRFC3339(customDate) : undefined;
      default:
        return undefined;
    }
  };

  return (
    <div className="mt-10 p-6 bg-gray-100 dark:bg-transparent border rounded-lg shadow-lg">
      {!isDialog && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Generate QR Code
        </h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-gray-700 dark:text-gray-200">
            URL*
          </Label>
          <Input
            id="url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
            Name for QR*
          </Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome link"
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-gray-700 dark:text-gray-200">
            Expiry Date*
          </Label>
          <Select onValueChange={setExpiryOption} required>
            <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select expiry option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>

          {expiryOption === "custom" && (
            <div className="space-y-2 mt-2">
              <Label className="text-gray-700 dark:text-gray-200">
                Custom Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? (
                      format(customDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    className="bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <Button type="submit" className="w-fit ml-auto mr-0">
          Create QR Code
        </Button>
      </form>
    </div>
  );
}
