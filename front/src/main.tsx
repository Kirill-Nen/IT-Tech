import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { SocketProvider } from './utils/useSocket.tsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <SocketProvider url="http://localhost:9000">
      <App />
    </SocketProvider>
  )
}
