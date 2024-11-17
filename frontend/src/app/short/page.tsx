import UrlShortenerForm from "@/components/url-shortener-form"
import Navbar from "@/components/navbar"

export default function UrlShortenerPage() {
    return (
        <>
            <Navbar />
            <main className="max-w-2xl mx-auto">
                <UrlShortenerForm isDialog={false} />
            </main >
        </>
    )
}