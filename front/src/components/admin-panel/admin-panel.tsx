import { act, useEffect, useState } from "react"

type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    dateRegistrationDate: string;
    status: 'active' | 'deleted';
}

type Event = {
    id: number
    name: string,
    img: string,
    start: string,
    end: string
    people: number,
    status: 'active' | 'end',
    price: number | 'free',
    current_participants: number,
    max_participantsl: number
}

export const AdminPanel = () => {
    const [users, setUsers] = useState<User[]>([])
    const [events, setEvents] = useState<Event[]>([])


    const handleActionForUser = async (email: string, action: 'patch' | 'delete') => {
        if (action === 'delete') {
            const res = await fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    email: email
                })
            })
        } else if (action === 'patch') {
            return <div>
                {/*модалка*/}
            </div>
        }
    }

    const handleActionForEvent = async (id: number, action: 'patch' | 'delete') => {
        if (action === 'delete') {
            const res = await fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    id: id
                })
            })
        } else if (action === 'patch') {
            return <div>
                {/*модалка*/}
            </div>
        }
    }

    useEffect(() => {
        fetch('')
            .then((response: Response) => response.json())
            .then((data: User[]) => {
                setUsers(data)
            })

        fetch('')
            .then((response: Response) => response.json())
            .then((data: Event[]) => {
                setEvents(data)
            })
    }, [])

    return (
        <div>
            <div>
                {users.map((i) => {
                    return <div key={i.id}>
                        {Object.entries(i).map(([key, value]) => {
                            return (<div key={key} className="user-info">
                                <strong>{key}:</strong> {value}
                            </div>
                            )
                        })}
                        <button onClick={() => { handleActionForUser(i.email, 'patch') }}>Изменить</button>
                        <button onClick={() => { handleActionForUser(i.email, 'delete') }}>Удалить</button>
                    </div>
                })}
            </div>
            <div>
                {events.map((i) => {
                    return <div key={i.id}>
                        {Object.entries(i).map(([key, value]) => {
                            return (<div key={key} className="user-info">
                                <strong>{key}:</strong> {value}
                            </div>
                            )
                        })}
                        <button onClick={() => { handleActionForEvent(i.id, 'patch') }}>Изменить</button>
                        <button onClick={() => { handleActionForEvent(i.id, 'delete') }}>Удалить</button>
                    </div>
                })}
            </div>
        </div>


    )
}