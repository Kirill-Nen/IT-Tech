import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'dist')))

io.on('connection', (socket) => {
    console.log('Socket Connect');
    
})

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

server.listen(9000, () => {
    console.log('🚀 Server: http://localhost:9000')
})