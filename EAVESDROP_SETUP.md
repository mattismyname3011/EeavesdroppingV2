# Eavesdropping Demo - Setup Documentation

## Overview

This is a simple eavesdropping demonstration that shows how messages can be intercepted in unsecured communication channels. The project consists of three main components:

- **Computer 1**: One participant in the conversation
- **Computer 2**: Second participant in the conversation
- **Eavesdropper**: A third party that can view all messages being exchanged

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** for styling
- **shadcn/ui** for UI components

### Backend/Real-time Communication
- **WebSocket** via Socket.IO
- **Node.js/Bun** runtime
- Custom mini-service for message routing

## Architecture

```
┌─────────────┐
│ Computer 1  │
│  (Sender)   │
└──────┬──────┘
       │
       │ Messages
       │
       ▼
┌─────────────────────┐
│  WebSocket Server   │
│   (Port 3004)       │
└──┬──────┬───────────┘
   │      │
   │      │ Broadcast
   │      │
   │      ▼
   │  ┌─────────────┐
   │  │ Computer 2  │
   │  │ (Receiver)  │
   │  └─────────────┘
   │
   │
   ▼
┌─────────────┐
│Eavesdropper │
│  (Viewer)   │
└─────────────┘
```

## Project Structure

```
/home/z/my-project/
├── src/
│   └── app/
│       ├── page.tsx                 # Main landing page
│       ├── computer1/
│       │   └── page.tsx             # Computer 1 interface
│       ├── computer2/
│       │   └── page.tsx             # Computer 2 interface
│       └── eavesdropper/
│           └── page.tsx             # Eavesdropper interface
├── mini-services/
│   └── eavesdrop-service/
│       ├── index.ts                 # WebSocket server
│       ├── package.json             # Service dependencies
│       └── service.log              # Service logs
└── package.json                    # Main project dependencies
```

## Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+) or **Bun** runtime
- **npm** or **bun** package manager

### Step 1: Install Main Project Dependencies

```bash
cd /home/z/my-project
bun install
```

### Step 2: Install WebSocket Service Dependencies

```bash
cd /home/z/my-project/mini-services/eavesdrop-service
bun install
```

### Step 3: Start the WebSocket Service

The WebSocket service runs on port 3004 and handles real-time message routing.

```bash
cd /home/z/my-project/mini-services/eavesdrop-service
nohup bun run dev > service.log 2>&1 &
```

To verify the service is running:
```bash
tail -f service.log
```

You should see:
```
Eavesdrop WebSocket server running on port 3004
```

### Step 4: Start the Next.js Development Server

The Next.js server runs on port 3000.

```bash
cd /home/z/my-project
bun run dev
```

The application will be available at: `http://localhost:3000`

### Step 5: Access the Application

Open your browser and navigate to `http://localhost:3000`

You'll see the main landing page with three options:
1. **Computer 1** - Click to open Computer 1 interface
2. **Computer 2** - Click to open Computer 2 interface
3. **Eavesdropper** - Click to open the eavesdropper view

## Usage Guide

### Testing the Eavesdropping

1. **Open the application**: Go to `http://localhost:3000`

2. **Open Computer 1**: Click on "Open Computer 1" button. This will open a new browser tab/window for Computer 1.

3. **Open Computer 2**: Click on "Open Computer 2" button. This will open a new browser tab/window for Computer 2.

4. **Open Eavesdropper**: Click on "Open Eavesdropper" button. This will open a new browser tab/window for the eavesdropper.

5. **Start communicating**:
   - In Computer 1, type a message and click "Send"
   - The message will appear in Computer 2's message list
   - The message will also appear in the Eavesdropper's intercepted messages list

6. **Continue the conversation**:
   - Computer 2 can reply
   - Both messages will be visible to the eavesdropper
   - Both computers can see the messages they exchange

### Features

#### Computer 1 & Computer 2
- Send text messages in real-time
- Receive messages from the other computer
- Visual indication of connection status
- Message history with timestamps
- Different colored message bubbles (blue for your messages, gray for received)

#### Eavesdropper
- View all intercepted messages in real-time
- Statistics showing total messages and breakdown by sender
- Clear message history option
- Visual badges indicating message source (Computer 1 or Computer 2)
- Connection status indicator

## WebSocket Protocol

### Events

#### From Client to Server

1. **`message-from-computer1`**
   - Emitted by Computer 1 when sending a message
   - Payload: `{ content: string }`

2. **`message-from-computer2`**
   - Emitted by Computer 2 when sending a message
   - Payload: `{ content: string }`

#### From Server to Client

1. **`message-to-computer1`**
   - Emitted to Computer 1 when Computer 2 sends a message
   - Payload: Message object

2. **`message-to-computer2`**
   - Emitted to Computer 2 when Computer 1 sends a message
   - Payload: Message object

3. **`eavesdropped-message`**
   - Emitted to all eavesdropper clients when any computer sends a message
   - Payload: Message object

4. **`message-history`**
   - Emitted to new eavesdropper connections with all previous messages
   - Payload: Array of Message objects

### Message Object

```typescript
interface Message {
  id: string           // Unique message ID
  sender: 'computer1' | 'computer2'  // Message sender
  content: string      // Message text
  timestamp: Date      // Message timestamp
}
```

## Troubleshooting

### WebSocket Service Not Running

**Symptoms**: Computers show "Disconnected" status

**Solution**:
```bash
# Check if service is running
ps aux | grep eavesdrop-service

# If not running, start it
cd /home/z/my-project/mini-services/eavesdrop-service
nohup bun run dev > service.log 2>&1 &

# Check logs
tail -f service.log
```

### Port Already in Use

**Symptoms**: Service fails to start with "EADDRINUSE" error

**Solution**:
```bash
# Find process using port 3004
lsof -i :3004

# Kill the process
kill <PID>

# Restart the service
cd /home/z/my-project/mini-services/eavesdrop-service
nohup bun run dev > service.log 2>&1 &
```

### Messages Not Appearing

**Symptoms**: Messages sent but not received

**Solutions**:
1. Check if WebSocket service is running
2. Verify connection status indicators on each page
3. Check browser console for JavaScript errors
4. Refresh the page and try again

### 404 Errors on Pages

**Symptoms**: Getting 404 errors when navigating to pages

**Solution**:
1. Ensure the Next.js dev server is running
2. Check that page files exist in correct directories:
   - `src/app/computer1/page.tsx`
   - `src/app/computer2/page.tsx`
   - `src/app/eavesdropper/page.tsx`
3. Restart the Next.js dev server

### Hot Reload Not Working

**Symptoms**: Changes to code not reflecting immediately

**Solution**:
1. The WebSocket service uses `--hot` flag for hot reload
2. Next.js has built-in hot reload
3. If issues persist, restart both services

## Development

### Adding New Features

#### To Add a New Computer Participant:

1. Create a new page directory: `src/app/computer3/page.tsx`
2. Update the WebSocket server in `mini-services/eavesdrop-service/index.ts`:
   ```typescript
   // Add new event handlers
   socket.on('message-from-computer3', (data: { content: string }) => {
     // Handle message routing
   })

   // Emit to computer 3 when needed
   io.emit('message-to-computer3', message)
   ```
3. Update types and UI components accordingly

#### To Add Encryption:

The current implementation uses plain text for demonstration purposes. To add encryption:

1. Implement end-to-end encryption using Web Crypto API
2. Generate public/private key pairs for each participant
3. Encrypt messages before sending
4. Decrypt messages on receipt
5. The eavesdropper would only see encrypted ciphertext

### Code Quality

To check code quality:

```bash
cd /home/z/my-project
bun run lint
```

## Security Considerations

### Current Implementation
- **No Encryption**: Messages are transmitted in plain text
- **No Authentication**: Anyone can connect to the WebSocket server
- **No Access Control**: No restrictions on who can eavesdrop

### Real-World Security
In production applications, always implement:
- **TLS/SSL**: Secure WebSocket connections (wss://)
- **End-to-End Encryption**: Messages encrypted between participants
- **Authentication**: Verify participant identities
- **Access Control**: Restrict who can join conversations
- **Message Integrity**: Ensure messages haven't been tampered with

### Best Practices

1. **Never transmit sensitive data in plain text**
2. **Use industry-standard encryption algorithms**
3. **Implement proper authentication and authorization**
4. **Regular security audits and penetration testing**
5. **Keep dependencies updated**
6. **Follow security best practices for your framework**

## Deployment

### Production Deployment

1. **Build the application**:
   ```bash
   cd /home/z/my-project
   bun run build
   ```

2. **Start the WebSocket service**:
   ```bash
   cd /home/z/my-project/mini-services/eavesdrop-service
   bun run start
   ```

3. **Start the Next.js server**:
   ```bash
   cd /home/z/my-project
   bun run start
   ```

### Environment Variables

Create a `.env` file for production configuration:

```env
# WebSocket service port
WEBSOCKET_PORT=3004

# Next.js port
PORT=3000

# Node environment
NODE_ENV=production
```

## Summary

This eavesdropping demo illustrates a fundamental security concept: messages transmitted over unsecured channels can be intercepted by third parties. The demonstration shows:

- How real-time communication works using WebSockets
- How messages can be intercepted and viewed by eavesdroppers
- The importance of encryption in secure communications
- Why end-to-end encryption is necessary for privacy

**Remember**: This is for educational purposes only. Always use encryption and secure communication protocols in real-world applications!
