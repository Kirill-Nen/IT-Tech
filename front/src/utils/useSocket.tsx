import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null,
    isConnect: boolean
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnect: false
})

export const useSocket = () => useContext(SocketContext)

type SocketProviderType = {
    children: ReactNode,
    url: string
}

export const SocketProvider: FC<SocketProviderType> = ({ children, url }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnect, setIsConnect] = useState<boolean>(false)

    useEffect(() => {
        const socketExz = io(url)
        setSocket(socketExz)

        socketExz.on('connect', () => {
            console.log('Socket connect');
            
            setIsConnect(true)
        })

        socketExz.on('disconnect', () => {
            setIsConnect(false)
        })

        return () => {
            setSocket(null)
            setIsConnect(false)
        }
    }, [url])

    return (
        <SocketContext.Provider value={{socket, isConnect}}>
            {children}
        </SocketContext.Provider>
    )
}