import { useEffect, useState } from "react"

export type ActiveEvent = {
    name: string,
    img: URL | string,
    dates: {
        start: Date,
        end: Date
    },
    people: number,
    status: 'active' | 'end',
    price: number
}

export const usePromise = (url: string, type: string) => {
    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const abortController = new AbortController()

        const fetchData = async() => {
            try {
                const response = await fetch(url, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                        'type': type
                    },
                    signal: abortController.signal
                })

                if (!response.ok) {
                    throw new Error('Ошибка загрузки мероприятий')
                }

                const events: ActiveEvent[] = await response.json()
                setActiveEvents(events)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка');
            }
        }

        fetchData()

        return () => {
            abortController.abort()
        }
    }, [type, url])

    return {activeEvents, error}
}