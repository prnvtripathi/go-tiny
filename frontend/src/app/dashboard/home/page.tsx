'use client'

import { useEffect, useState } from 'react'
import { Trash2, Plus, ExternalLink, Copy, MoreVertical } from 'lucide-react'
import { format, isAfter } from 'date-fns'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import UrlShortenerForm from '@/components/url-shortener-form'
import Link from 'next/link'
import { toast } from 'sonner'

type Url = {
    original_url: string
    name: string
    short_code: string
    expires_at: Date
    url_id: number
    // clicks: number //TODO: Implement click tracking
}

export default function Dashboard() {
    const [urls, setUrls] = useState<Url[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchUrls() {
        setLoading(true)
        try {
            const response = await fetch('/api/backend/getUrls')
            const data = await response.json()
            console.log("data", data.urls)
            setUrls(data?.urls)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch URLs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUrls()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/backend/deleteUrl`, {
                body: JSON.stringify({ url_id: id }),
                method: 'DELETE',
            })
            if (response.ok) {
                fetchUrls()
            }
            const data = await response.json()
            toast.success(data.message)
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete URL")
        }
    }


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

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
                            <DialogDescription>
                                Add a new URL to shorten
                            </DialogDescription>
                        </DialogHeader>
                        <UrlShortenerForm isDialog={true} />
                    </DialogContent>
                </Dialog>
            </div>
            <Table className=''>
                <TableCaption>
                    The Hall of Fame for Your Little Links 🚀
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Original URL</TableHead>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {urls && urls.map((url, index) => (
                        <TableRow key={index}>
                            <TableCell>{url.name}</TableCell>
                            <TableCell className="font-medium">{url.original_url}</TableCell>
                            <TableCell>
                                <Link href={url.short_code} className='text-blue-300 hover:underline hover:underline-offset-2' target='_blank'>
                                    {url.short_code}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <span className={isAfter(new Date(), url.expires_at) ? 'text-red-500' : 'text-green-500'}>
                                    {format(url.expires_at, 'dd MMM yyyy')}
                                </span>
                            </TableCell>
                            {/* <TableCell>{url.clicks}</TableCell> */}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => copyToClipboard(url.short_code)}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy short URL
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.open(url.original_url, '_blank')}>
                                            <ExternalLink className="mr-2 h-4 w-4" /> Visit original URL
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(url.url_id)} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {loading && (
                        <TableSkeleton />
                    )}
                </TableBody>
            </Table>
        </main>
    )
}

function TableSkeleton() {
    return (
        <>
            <TableRow>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[20px] h-[20px] rounded-full' />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[20px] h-[20px] rounded-full' />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[200px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[100px] h-3 rounded-full' />
                </TableCell>
                <TableCell>
                    <Skeleton className='w-[20px] h-[20px] rounded-full' />
                </TableCell>
            </TableRow>
        </>
    )
}