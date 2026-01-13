# Eavesdropping Demo - Quick Start Guide

## What is this?

A simple demonstration of real-time message interception. It shows how messages between two computers can be seen by a third party (the eavesdropper).

## Quick Start (3 Steps)

### 1. Start the WebSocket Service
```bash
cd /home/z/my-project/mini-services/eavesdrop-service
nohup bun run dev > service.log 2>&1 &
```

### 2. Start the Application
```bash
cd /home/z/my-project
bun run dev
```

### 3. Open Your Browser
Go to: **http://localhost:3000**

## How to Test

1. **Open the main page** at `http://localhost:3000`

2. **Open Computer 1** - Click "Open Computer 1" (opens in new tab)

3. **Open Computer 2** - Click "Open Computer 2" (opens in new tab)

4. **Open Eavesdropper** - Click "Open Eavesdropper" (opens in new tab)

5. **Start Chatting:**
   - Type a message in Computer 1 and click "Send"
   - Watch it appear in Computer 2 and the Eavesdropper
   - Reply from Computer 2
   - Both messages appear in the Eavesdropper view

## What You'll See

### Computer 1 & Computer 2
- Send and receive messages
- Blue/Green message bubbles for your messages
- Gray bubbles for received messages
- Connection status indicator

### Eavesdropper
- All messages from both computers
- Statistics (total messages, breakdown by sender)
- Real-time updates as messages are sent

## Key Points

- **Real-time**: Messages appear instantly
- **No Encryption**: Messages are sent in plain text (by design for this demo)
- **Educational Purpose**: Demonstrates why encryption is important

## Troubleshooting

### "Disconnected" Status
```bash
# Check if WebSocket service is running
ps aux | grep eavesdrop-service

# If not, restart it
cd /home/z/my-project/mini-services/eavesdrop-service
nohup bun run dev > service.log 2>&1 &

# Check logs
tail -f service.log
```

### Pages Not Found
Wait a few seconds for the dev server to compile the new pages, then refresh your browser.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: WebSocket (Socket.IO), Node.js/Bun

## Full Documentation

For detailed setup, architecture, and security considerations, see [EAVESDROP_SETUP.md](./EAVESDROP_SETUP.md)

---

**⚠️ Important**: This is for educational purposes only. Always use encryption in real-world applications!
