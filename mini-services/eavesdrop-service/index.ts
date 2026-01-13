import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

interface Message {
  id: string
  sender: 'computer1' | 'computer2'
  content: string
  timestamp: Date
}

// Store all messages for the eavesdropper
const messageHistory: Message[] = []

const generateMessageId = () => Math.random().toString(36).substr(2, 9)

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Send message history to new connections (for eavesdropper)
  socket.emit('message-history', messageHistory)

  // Computer 1 sends a message
  socket.on('message-from-computer1', (data: { content: string }) => {
    const message: Message = {
      id: generateMessageId(),
      sender: 'computer1',
      content: data.content,
      timestamp: new Date()
    }

    messageHistory.push(message)

    // Send to Computer 2
    io.emit('message-to-computer2', message)

    // Send to Eavesdropper
    io.emit('eavesdropped-message', message)

    console.log(`Computer 1: ${data.content}`)
  })

  // Computer 2 sends a message
  socket.on('message-from-computer2', (data: { content: string }) => {
    const message: Message = {
      id: generateMessageId(),
      sender: 'computer2',
      content: data.content,
      timestamp: new Date()
    }

    messageHistory.push(message)

    // Send to Computer 1
    io.emit('message-to-computer1', message)

    // Send to Eavesdropper
    io.emit('eavesdropped-message', message)

    console.log(`Computer 2: ${data.content}`)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error (${socket.id}):`, error)
  })
})

const PORT = 3004
httpServer.listen(PORT, () => {
  console.log(`Eavesdrop WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})
