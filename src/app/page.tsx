'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Computer, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EavesdropPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">
              Eavesdropping Demo
            </h1>
            <p className="text-lg text-slate-600">
              A demonstration of real-time message interception
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Computer 1 */}
            <Card className="hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Computer className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Computer 1</CardTitle>
                <CardDescription>
                  First participant - send messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/computer1">
                  <Button className="w-full" variant="default">
                    Open Computer 1
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Computer 2 */}
            <Card className="hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Computer className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Computer 2</CardTitle>
                <CardDescription>
                  Second participant - send and receive messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/computer2">
                  <Button className="w-full" variant="default">
                    Open Computer 2
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Eavesdropper */}
            <Card className="hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Eavesdropper</CardTitle>
                <CardDescription>
                  View all intercepted messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/eavesdropper">
                  <Button className="w-full" variant="default">
                    Open Eavesdropper
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <p>Computer 1 and Computer 2 communicate with each other in real-time</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 font-semibold text-xs">2</span>
                </div>
                <p>Messages are transmitted through a WebSocket server</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 font-semibold text-xs">3</span>
                </div>
                <p>The Eavesdropper can see all messages being exchanged</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto py-6 bg-slate-900 text-slate-400 text-sm text-center">
        <p>Eavesdropping Demo - For educational purposes only</p>
      </footer>
    </div>
  )
}
