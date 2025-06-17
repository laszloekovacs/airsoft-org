import { useDeferredValue, useEffect, useState } from "react"
import { useFetcher } from "react-router"
import { Input } from "../ui/input"



export default function SearchContainer() {
    const fetcher = useFetcher()



    return (
        <div>
            <fetcher.Form method="post">
                <Input name="query" onChange={e => fetcher.load(`/api/search?q=${e.target.value}`)
                } />
            </fetcher.Form>
        </div>
    )
}



const SearchField = () => {

    return (
        <div>

        </div>
    )
}