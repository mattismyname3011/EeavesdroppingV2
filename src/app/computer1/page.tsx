'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Computer, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

type Message = {
  id: string
  sender: 'computer1' | 'computer2'
  content: string
  timestamp: Date | string
}

export default function Computer1Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io('/?XTransformPort=3004', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    })

    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('message-to-computer1', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      socket.emit('message-from-computer1', { content: inputMessage.trim() })

      // Add our own message to display
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'computer1',
        content: inputMessage.trim(),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])

      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Computer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Computer 1</CardTitle>
                  <p className="text-sm text-slate-600">
                    Connected to Computer 2
                  </p>
                </div>
                <div className="ml-auto">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isConnected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isConnected ? '● Connected' : '● Disconnected'}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 w-full border rounded-md p-4">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === 'computer1' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'computer1'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {msg.sender === 'computer1' ? 'You' : 'Computer 2'}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          <span className="text-xs opacity-75 mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Input */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!isConnected || !inputMessage.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-auto py-4 bg-slate-900 text-slate-400 text-xs text-center">
        <p>Computer 1 - Eavesdropping Demo</p>
      </footer>
    </div>
  )
}
