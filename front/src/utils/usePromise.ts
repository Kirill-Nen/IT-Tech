import { useEffect, useState } from "react"

export type ActiveEvent = {
    id: number
    name: string,
    img: string,
    dates: {
        start: string,
        end: string
    },
    people: number,
    status: 'active' | 'end',
    price: number | 'free',
    current_participants: number,
    max_participantsl: number,
    isParticipantslLimited: boolean
    user_status: boolean
}

export const usePromise = (url: string, type: string, isLogin: boolean) => {
    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const abortController = new AbortController()

        const fetchData = async() => {
            try {
                const response = await fetch(url, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: type,
                        isLogin: isLogin
                    }),
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