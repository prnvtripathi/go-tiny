"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatRFC3339, format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function UrlShortenerStepForm() {

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [name, setName] = useState("");
  const [expiryOption, setExpiryOption] = useState("");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);

  const router = useRouter();

  const totalSteps = 4;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDate = calculateExpiryDate();

    const response = await fetch(`/api/backend/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        name,
        code: {
          shortCode,
          isCustomCode: !!shortCode,
        },
        expiryDate,
        isCustomExpiry: expiryOption === "custom",
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Short URL created successfully");
      router.push(`/dashboard`);
    } else {
      toast.error(data.message);
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

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 h-2 mb-4">
      <div
        className="bg-blue-600 h-2"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="mt-10 p-6 bg-white dark:bg-black/90 rounded-lg shadow-md">
      <ProgressBar />
      <form onSubmit={handleSubmit} className="space-y-6 min-h-48 flex flex-col">
        {currentStep === 1 && (
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
            <div className="flex justify-end mt-4">
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-2">
            <Label
              htmlFor="shortCode"
              className="text-gray-700 dark:text-gray-200"
            >
              Custom Short Code (Optional)
            </Label>
            <Input
              id="shortCode"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              maxLength={8}
              pattern="[A-Za-z0-9]{1,8}"
              placeholder="If you want a custom short code, enter it here"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Label className="text-gray-600 ml-1 text-xs dark:text-gray-500">
              Custom short code can only contain letters and numbers
            </Label>
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
              Name for URL*
            </Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome link"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-2">
            <Label
              htmlFor="expiry"
              className="text-gray-700 dark:text-gray-200"
            >
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

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Short URL
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
