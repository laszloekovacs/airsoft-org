import { useEffect, useState } from "react"
import type { Route } from "./+types/s3"


export const loader = async () => {
    const key = process.env.CHIBI_API_KEY!

    return { key }
}

export default function S3Page({ loaderData }: Route.ComponentProps) {
    const { key } = loaderData
    const [result, setResult] = useState<null>()
    const [pending, setPending] = useState(true)

    useEffect(() => {
        const headers = new Headers()
        headers.append("apiKey", key)
        setPending(true)
        fetch("https://chibi.am4.duckdns.org/api/admin/files", {
            method: "GET",
            headers
        })
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(() => setResult(null))
            .finally(() => setPending(false))

    }, [key])


    return (
        <div>
            <p>seems to work </p>
            <pre>{key}</pre>

            {!pending && (<pre>{
                JSON.stringify(result, null, 2)
            }</pre>)}
        </div>
    )
}