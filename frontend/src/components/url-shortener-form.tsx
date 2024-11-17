'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { formatRFC3339, format } from "date-fns"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function UrlShortenerForm({ isDialog }: { isDialog?: boolean }) {
    const [url, setUrl] = useState('')
    const [shortCode, setShortCode] = useState('')
    const [isCustomCode, setIsCustomCode] = useState(false)
    const [name, setName] = useState('')
    const [expiryOption, setExpiryOption] = useState('')
    const [customDate, setCustomDate] = useState<Date | undefined>(undefined)
    const [isCustomExpiry, setIsCustomExpiry] = useState(false)
    let expiryDate: string | undefined

    const router = useRouter()

    const setExpiryDate = (value: string) => {
        switch (value) {
            case '1':
                expiryDate = formatRFC3339(new Date(Date.now() + 86400000))
                break;
            case '7':
                expiryDate = formatRFC3339(new Date(Date.now() + 604800000))
                break;
            case 'custom':
                if (customDate && isCustomExpiry) {
                    expiryDate = formatRFC3339(customDate)
                }
                break;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setExpiryDate(expiryOption)

        const response = await fetch(`/api/backend/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                name,
                code: {
                    shortCode,
                    isCustomCode,
                },
                expiryDate,
                isCustomExpiry,
            })
        })

        const data = await response.json()

        if (data.success) {
            toast.success('Short URL created successfully')
            router.push(`/dashboard`)
        } else {
            toast.error(data.message)
        }
    }

    return (
        <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {
                !isDialog &&
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create Short URL</h2>
            }
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="url" className="text-gray-700 dark:text-gray-200">URL*</Label>
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
                    <Label htmlFor="shortCode" className="text-gray-700 dark:text-gray-200">Custom Short Code (Optional)</Label>
                    <Input
                        id="shortCode"
                        value={shortCode}
                        onChange={(e) => {
                            setShortCode(e.target.value)
                            setIsCustomCode(true)
                        }}
                        maxLength={8}
                        pattern="[A-Za-z0-9]{1,8}"
                        placeholder="If you want a custom short code, enter it here"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Label className="text-gray-600 ml-1 text-xs dark:text-gray-500">Custom short code can only contain letters and numbers</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Name for URL*</Label>
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
                    <Label htmlFor="expiry" className="text-gray-700 dark:text-gray-200">Expiry Date</Label>
                    <Select onValueChange={setExpiryOption}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Select expiry option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1" onSelect={() => {
                                setIsCustomCode(false)
                            }}>1 Day</SelectItem>
                            <SelectItem value="7" onSelect={() => {
                                setIsCustomCode(false)
                            }}>7 Days</SelectItem>
                            <SelectItem value="custom">Custom Date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {expiryOption === 'custom' && (
                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-200">Custom Expiry Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={customDate}
                                    onSelect={() => {
                                        setIsCustomExpiry(true)
                                        setCustomDate(customDate)
                                    }}
                                    initialFocus
                                    className="bg-white dark:bg-gray-800"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Create Short URL</Button>
            </form>
        </div>
    )
}