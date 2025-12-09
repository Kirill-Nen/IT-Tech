import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SocketProvider } from './utils/useSocket.tsx'

createRoot(document.getElementById('root')!).render(
  <SocketProvider url="http://localhost:3001">
    <App />
  </SocketProvider>
)
