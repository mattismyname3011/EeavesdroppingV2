'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Eye, ArrowLeft, Activity } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

type Message = {
  id: string
  sender: 'computer1' | 'computer2'
  content: string
  timestamp: Date | string
}

export default function EavesdropperPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [stats, setStats] = useState({
    totalMessages: 0,
    computer1Messages: 0,
    computer2Messages: 0
  })

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

    // Receive message history on connection
    socketInstance.on('message-history', (history: Message[]) => {
      setMessages(history)
      updateStats(history)
    })

    // Receive new messages
    socketInstance.on('eavesdropped-message', (msg: Message) => {
      setMessages(prev => {
        const updated = [...prev, msg]
        updateStats(updated)
        return updated
      })
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const updateStats = (msgList: Message[]) => {
    setStats({
      totalMessages: msgList.length,
      computer1Messages: msgList.filter(m => m.sender === 'computer1').length,
      computer2Messages: msgList.filter(m => m.sender === 'computer2').length
    })
  }

  const clearMessages = () => {
    setMessages([])
    setStats({
      totalMessages: 0,
      computer1Messages: 0,
      computer2Messages: 0
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Eavesdropper</CardTitle>
                  <p className="text-sm text-slate-600">
                    Viewing all intercepted messages
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isConnected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isConnected ? '● Listening' : '● Disconnected'}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalMessages}</p>
                    <p className="text-xs text-slate-500">Total Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.computer1Messages}</p>
                    <p className="text-xs text-slate-500">From Computer 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.computer2Messages}</p>
                    <p className="text-xs text-slate-500">From Computer 2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Intercepted Messages</CardTitle>
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear
                </button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full border rounded-md p-4">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Eye className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">
                        No messages intercepted yet
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Messages will appear here when Computer 1 and Computer 2 communicate
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={
                                  msg.sender === 'computer1'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-green-600 text-green-600'
                                }
                              >
                                {msg.sender === 'computer1' ? 'Computer 1' : 'Computer 2'}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-slate-900">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Note:</strong> This is a demonstration of how messages can be intercepted
                  in unsecured communication channels. In real-world applications, always use
                  end-to-end encryption to protect sensitive communications.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-auto py-4 bg-slate-900 text-slate-400 text-xs text-center">
        <p>Eavesdropper - Eavesdropping Demo</p>
      </footer>
    </div>
  )
}
