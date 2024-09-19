"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


// TODO: make this function use the previous page's query params (if available) to make the back button work
// TODO use clsx to pass styling props
export default function WorldStatsCountryPageBackButton({className}: {className?: string}) {
    const router = useRouter()

    function handleGoBack() {
        if (history.length > 1) {
            router.back()
        }
        else {
            router.push("/countries")
        }
    }

    return (
        <Button
            variant="outline"
            className={className}
            onClick={handleGoBack}
        >
            Back to search results
        </Button>
    )
}