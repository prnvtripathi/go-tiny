'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Url, columns } from './columns'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UrlShortenerForm from '@/components/url-shortener-form'
import { toast } from 'sonner'
import { DataTable } from '@/components/ui/data-table'


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
            <DataTable columns={columns} data={urls} />
            <p className='text-center text-sm text-gray-600'>
                The hall of fame for your little links. 🚀
            </p>
        </main>
    )
}
